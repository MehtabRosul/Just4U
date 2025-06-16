
"use client";

import React from 'react';
import type { Product } from '@/lib/types';
import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

const WISHLIST_STORAGE_KEY = 'just4ugifts_wishlist';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isProductInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error)      {
      console.error("Failed to save wishlist to localStorage", error);
    }
  }, [wishlist]);

  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.find(item => item.id === product.id)) {
        toast({ title: "Already in Wishlist", description: `${product.name} is already in your wishlist.` });
        return prevWishlist;
      }
      toast({ title: "Added to Wishlist", description: `${product.name} has been added to your wishlist.` });
      return [...prevWishlist, product];
    });
  }, [toast]);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prevWishlist) => {
      const product = prevWishlist.find(item => item.id === productId);
      if (product) {
        toast({ title: "Removed from Wishlist", description: `${product.name} has been removed from your wishlist.`, variant: 'default' });
      }
      return prevWishlist.filter(item => item.id !== productId);
    });
  }, [toast]);

  const isProductInWishlist = useCallback((productId: string) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    toast({ title: "Wishlist Cleared", description: "Your wishlist has been cleared." });
  }, [toast]);

  const providerValue: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist,
    clearWishlist
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
