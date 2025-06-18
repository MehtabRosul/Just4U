
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
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
      // onAuthStateChanged will handle setting the user
      toast({ title: "Signed In", description: "Successfully signed in with Google." });
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
      toast({ title: "Sign In Failed", description: error.message || "Could not sign in with Google.", variant: "destructive" });
      setLoading(false); // Ensure loading is false on error
    }
  }, [toast]);

  const signOutUser = useCallback(async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting user to null
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
    } catch (error: any) {
      console.error("Error signing out: ", error);
      toast({ title: "Sign Out Failed", description: error.message || "Could not sign out.", variant: "destructive" });
      setLoading(false); // Ensure loading is false on error
    }
  }, [toast]);

  const value = { user, loading, signInWithGoogle, signOutUser };

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
