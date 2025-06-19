
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  type AuthError
} from 'firebase/auth';
import { auth, googleProvider, database } from '@/lib/firebase'; // Import database
import { ref, set, get, child, onValue, off } from "firebase/database"; // Firebase RTDB functions
import { useToast } from '@/hooks/use-toast';
import type { UserProfileDetails } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profileDetails: UserProfileDetails | null; // For phone, age
  loadingProfileDetails: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signOutUser: () => Promise<boolean>;
  signInWithEmailPass: (email: string, password: string) => Promise<boolean>;
  createUserWithEmailPass: (email: string, password: string) => Promise<boolean>;
  updateUserFirebaseProfile: (currentUser: User, profileData: { displayName?: string; photoURL?: string }) => Promise<void>;
  saveUserProfileDetails: (userId: string, details: UserProfileDetails) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileDetails, setProfileDetails] = useState<UserProfileDetails | null>(null);
  const [loadingProfileDetails, setLoadingProfileDetails] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        setLoadingProfileDetails(true);
        const profileDetailsRef = ref(database, `users/${currentUser.uid}/profileDetails`);
        const listener = onValue(profileDetailsRef, (snapshot) => {
          const data = snapshot.val();
          setProfileDetails(data || {}); // Initialize with empty object if no data
          setLoadingProfileDetails(false);
        }, (error) => {
          console.error("Error fetching profile details from RTDB: ", error);
          toast({ title: "Error", description: "Could not fetch profile details.", variant: "destructive" });
          setProfileDetails({}); // Initialize with empty object on error
          setLoadingProfileDetails(false);
        });
        // Cleanup listener when user logs out or component unmounts
        return () => off(profileDetailsRef, listener);
      } else {
        setProfileDetails(null);
        setLoadingProfileDetails(false);
      }
    });
    return () => unsubscribeAuth();
  }, [toast]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Check if it's a new user to initialize profileDetails
      const profileDetailsRef = ref(database, `users/${result.user.uid}/profileDetails`);
      const snapshot = await get(profileDetailsRef);
      if (!snapshot.exists()) {
        await set(profileDetailsRef, { phoneNumber: '', age: '' });
      }
      toast({ title: "Signed In", description: "Successfully signed in with Google." });
      return true;
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error signing in with Google: ", authError);
      toast({ title: "Sign In Failed", description: authError.message || "Could not sign in with Google.", variant: "destructive" });
      setLoading(false);
      return false;
    }
  }, [toast]);

  const signOutUser = useCallback(async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // User state and profileDetails will be cleared by onAuthStateChanged
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      return true;
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error signing out: ", authError);
      toast({ title: "Sign Out Failed", description: authError.message || "Could not sign out.", variant: "destructive" });
      setLoading(false);
      return false;
    }
  }, [toast]);

  const signInWithEmailPass = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Profile details should load via onAuthStateChanged listener
      return true;
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error signing in with email/password: ", authError);
      let friendlyMessage = "An error occurred during login.";
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
        friendlyMessage = "Invalid email or password. Please try again.";
      } else if (authError.code === 'auth/invalid-email') {
        friendlyMessage = "The email address is not valid.";
      }
      toast({ title: "Login Failed", description: friendlyMessage, variant: "destructive" });
      setLoading(false);
      return false;
    }
  }, [toast]);
  
  const createUserWithEmailPass = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Initialize profileDetails in RTDB for new user
      if (userCredential.user) {
        await set(ref(database, `users/${userCredential.user.uid}/profileDetails`), {
          phoneNumber: '',
          age: ''
        });
        // Set a default display name if desired, e.g., from email prefix
        const defaultDisplayName = email.split('@')[0];
        await updateProfile(userCredential.user, { displayName: defaultDisplayName });

      }
      return true;
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error creating user with email/password: ", authError);
      let friendlyMessage = "An error occurred during sign up.";
      if (authError.code === 'auth/email-already-in-use') {
        friendlyMessage = "This email address is already in use.";
      } else if (authError.code === 'auth/weak-password') {
        friendlyMessage = "The password is too weak. Please choose a stronger password.";
      } else if (authError.code === 'auth/invalid-email') {
        friendlyMessage = "The email address is not valid.";
      }
      toast({ title: "Sign Up Failed", description: friendlyMessage, variant: "destructive" });
      setLoading(false);
      return false;
    }
  }, [toast]);

  const updateUserFirebaseProfile = useCallback(async (
    currentUser: User, 
    profileData: { displayName?: string; photoURL?: string }
  ) => {
    if (!currentUser) throw new Error("User not authenticated for profile update.");
    try {
      await updateProfile(currentUser, profileData);
      // To reflect changes immediately if needed, though onAuthStateChanged often handles it
      // Forcing a re-fetch or local update of user object might be needed in some cases
      // For now, relying on onAuthStateChanged or page refresh
      setUser(prevUser => {
        if (prevUser && prevUser.uid === currentUser.uid) {
          return { ...prevUser, ...profileData, photoURL: profileData.photoURL ?? prevUser.photoURL };
        }
        return prevUser;
      });
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error updating Firebase profile: ", authError);
      throw new Error(authError.message || "Could not update Firebase profile.");
    }
  }, []);

  const saveUserProfileDetails = useCallback(async (userId: string, details: UserProfileDetails) => {
    if (!userId) {
      toast({ title: "Error", description: "User ID is missing.", variant: "destructive"});
      return;
    }
    try {
      await set(ref(database, `users/${userId}/profileDetails`), details);
      // This will trigger the onValue listener in useEffect to update profileDetails state
    } catch (error) {
      console.error("Error saving profile details to RTDB: ", error);
      throw new Error("Could not save profile details."); // Re-throw for AccountPage to handle
    }
  }, [toast]);

  const value = { 
    user, 
    loading, 
    profileDetails,
    loadingProfileDetails,
    signInWithGoogle, 
    signOutUser, 
    signInWithEmailPass, 
    createUserWithEmailPass,
    updateUserFirebaseProfile,
    saveUserProfileDetails
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

