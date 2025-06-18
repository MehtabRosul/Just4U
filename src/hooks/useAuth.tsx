
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile, // Import updateProfile
  type AuthError
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signOutUser: () => Promise<boolean>;
  signInWithEmailPass: (email: string, password: string) => Promise<boolean>;
  createUserWithEmailPass: (email: string, password: string) => Promise<boolean>;
  updateUserFirebaseProfile: (currentUser: User, profileData: { displayName?: string; photoURL?: string }) => Promise<void>; // New function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
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
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      // setUser(null) // onAuthStateChanged will handle this
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
      await createUserWithEmailAndPassword(auth, email, password);
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
      // onAuthStateChanged should pick up the changes and update the user state globally.
      // For immediate local update if needed, one might call setUser({...currentUser, ...profileData})
      // but it's usually better to let Firebase be the source of truth.
      // setUser(prevUser => prevUser ? ({ ...prevUser, ...profileData, displayName: profileData.displayName || prevUser.displayName }) : null);

    } catch (error) {
      const authError = error as AuthError;
      console.error("Error updating Firebase profile: ", authError);
      throw new Error(authError.message || "Could not update Firebase profile.");
    }
  }, []);

  const value = { 
    user, 
    loading, 
    signInWithGoogle, 
    signOutUser, 
    signInWithEmailPass, 
    createUserWithEmailPass,
    updateUserFirebaseProfile // Expose the new function
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
