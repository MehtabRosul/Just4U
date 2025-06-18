
"use client";

import React from 'react';
import type { Product } from '@/lib/types';
import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth

const WISHLIST_STORAGE_KEY_BASE = 'just4ugifts_wishlist';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isProductInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  loadWishlistForUser: (userId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth(); // Get user from useAuth

  const getWishlistStorageKey = useCallback(() => {
    return user ? `${WISHLIST_STORAGE_KEY_BASE}_${user.uid}` : null;
  }, [user]);

  const loadWishlistForUser = useCallback((userId: string) => {
    // This function can be called explicitly on login if needed,
    // but useEffect below handles initial load based on user state.
    try {
      const storageKey = `${WISHLIST_STORAGE_KEY_BASE}_${userId}`;
      const storedWishlist = localStorage.getItem(storageKey);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      } else {
        setWishlist([]); // Clear wishlist if no stored data for this user
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage for user", userId, error);
      setWishlist([]);
    }
  }, []);

  // Load wishlist when user changes or on initial load
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadWishlistForUser(user.uid);
      } else {
        setWishlist([]); // Clear wishlist if no user
      }
    }
  }, [user, authLoading, loadWishlistForUser]);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    const storageKey = getWishlistStorageKey();
    if (storageKey && wishlist.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(wishlist));
      } catch (error) {
        console.error("Failed to save wishlist to localStorage", error);
      }
    } else if (storageKey && wishlist.length === 0) {
      // If wishlist is empty for a logged-in user, remove the item from local storage
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error("Failed to remove wishlist from localStorage", error);
      }
    }
    // If no user (storageKey is null), wishlist is in-memory only and not persisted.
  }, [wishlist, getWishlistStorageKey]);

  const addToWishlist = useCallback((product: Product) => {
    if (!user) {
      setTimeout(() => {
        toast({
          title: "Please Sign In",
          description: "You need to be signed in to add items to your wishlist.",
          variant: "destructive"
        });
      }, 0);
      return;
    }
    setWishlist((prevWishlist) => {
      if (prevWishlist.find(item => item.id === product.id)) {
        setTimeout(() => {
          toast({ title: "Already in Wishlist", description: `${product.name} is already in your wishlist.` });
        }, 0);
        return prevWishlist;
      }
      setTimeout(() => {
        toast({ title: "Added to Wishlist", description: `${product.name} has been added to your wishlist.` });
      }, 0);
      return [...prevWishlist, product];
    });
  }, [user, toast]);

  const removeFromWishlist = useCallback((productId: string) => {
    if (!user) { // Should not happen if add is guarded, but good practice
      setTimeout(() => {
        toast({ title: "Error", description: "You must be signed in to modify your wishlist.", variant: "destructive" });
      }, 0);
      return;
    }
    setWishlist((prevWishlist) => {
      const product = prevWishlist.find(item => item.id === productId);
      if (product) {
        setTimeout(() => {
          toast({ title: "Removed from Wishlist", description: `${product.name} has been removed from your wishlist.`, variant: 'default' });
        }, 0);
      }
      return prevWishlist.filter(item => item.id !== productId);
    });
  }, [user, toast]);

  const isProductInWishlist = useCallback((productId: string) => {
    if (!user) return false; // Not in wishlist if not logged in
    return wishlist.some(item => item.id === productId);
  }, [user, wishlist]);

  const clearWishlist = useCallback(() => {
    if (!user) {
      setTimeout(() => {
        toast({ title: "Error", description: "You must be signed in to clear your wishlist.", variant: "destructive" });
      }, 0);
      return;
    }
    setWishlist([]);
    const storageKey = getWishlistStorageKey();
    if (storageKey) {
        localStorage.removeItem(storageKey); // Also clear from storage
    }
    setTimeout(() => {
      toast({ title: "Wishlist Cleared", description: "Your wishlist has been cleared." });
    }, 0);
  }, [user, toast, getWishlistStorageKey]);

  const providerValue: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist,
    clearWishlist,
    loadWishlistForUser,
  };

  return React.createElement(
    WishlistContext.Provider,
    { value: providerValue },
    children
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
