
"use client";

import React, { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { database } from '@/lib/firebase';
import { ref, onValue, off, set, remove } from 'firebase/database';
import { PRODUCTS } from '@/lib/data'; // To enrich product details from IDs

interface WishlistContextType {
  wishlist: Product[]; // Now stores full Product objects, enriched from IDs
  loading: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isProductInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  // Stores product IDs as keys with a boolean true or timestamp as value from RTDB
  const [wishlistProductIds, setWishlistProductIds] = useState<Record<string, boolean | string>>({});
  // Stores the enriched Product objects for the UI
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Effect to fetch wishlist IDs from RTDB
  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (user) {
      setLoading(true);
      const wishlistRef = ref(database, `users/${user.uid}/wishlist`);
      const listener = onValue(wishlistRef, (snapshot) => {
        const data = snapshot.val();
        setWishlistProductIds(data || {});
        setLoading(false);
      }, (error) => {
        console.error("Error fetching wishlist: ", error);
        toast({ title: "Error", description: "Could not fetch wishlist.", variant: "destructive" });
        setWishlistProductIds({});
        setLoading(false);
      });
      return () => off(wishlistRef, listener);
    } else {
      setWishlistProductIds({});
      setWishlist([]); // Clear full wishlist too
      setLoading(false);
    }
  }, [user, authLoading, toast]);

  // Effect to populate full wishlist products from IDs
  useEffect(() => {
    const productDetails = Object.keys(wishlistProductIds)
      .map(productId => {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) {
          console.warn(`[Wishlist] Product with ID "${productId}" not found in local data. It might be stale data from a previous session.`);
        }
        return product;
      })
      .filter(Boolean) as Product[]; // Filter out any undefined products if IDs don't match
    setWishlist(productDetails);
  }, [wishlistProductIds]);

  const addToWishlist = useCallback(async (product: Product) => {
    if (!user) {
      setTimeout(() => {
        toast({ title: "Please Sign In", description: "You need to be signed in to add items to your wishlist.", variant: "destructive" });
      }, 0);
      return;
    }
    if (wishlistProductIds[product.id]) {
      setTimeout(() => {
        toast({ title: "Already in Wishlist", description: `${product.name} is already in your wishlist.` });
      }, 0);
      return;
    }
    try {
      // Store boolean true or a timestamp if needed, e.g., new Date().toISOString()
      await set(ref(database, `users/${user.uid}/wishlist/${product.id}`), true); 
      setTimeout(() => {
        toast({ title: "Added to Wishlist", description: `${product.name} has been added to your wishlist.` });
      }, 0);
    } catch (error) {
      console.error("Error adding to wishlist: ", error);
      setTimeout(() => {
        toast({ title: "Error", description: "Could not add to wishlist.", variant: "destructive" });
      }, 0);
    }
  }, [user, toast, wishlistProductIds]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!user) return;
    try {
      await remove(ref(database, `users/${user.uid}/wishlist/${productId}`));
      const product = PRODUCTS.find(p => p.id === productId);
      setTimeout(() => {
        if (product) {
          toast({ title: "Removed from Wishlist", description: `${product.name} has been removed from your wishlist.` });
        } else {
          toast({ title: "Removed from Wishlist", description: `Item removed from your wishlist.` });
        }
      }, 0);
    } catch (error) {
      console.error("Error removing from wishlist: ", error);
      setTimeout(() => {
        toast({ title: "Error", description: "Could not remove from wishlist.", variant: "destructive" });
      }, 0);
    }
  }, [user, toast]);

  const isProductInWishlist = useCallback((productId: string) => {
    if (!user) return false;
    return !!wishlistProductIds[productId];
  }, [user, wishlistProductIds]);

  const clearWishlist = useCallback(async () => {
    if (!user) return;
    try {
      await set(ref(database, `users/${user.uid}/wishlist`), null);
      setTimeout(() => {
        toast({ title: "Wishlist Cleared", description: "Your wishlist has been cleared." });
      }, 0);
    } catch (error) {
      console.error("Error clearing wishlist: ", error);
      setTimeout(() => {
        toast({ title: "Error", description: "Could not clear wishlist.", variant: "destructive" });
      }, 0);
    }
  }, [user, toast]);

  const providerValue: WishlistContextType = {
    wishlist, // Provide the enriched list
    loading,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist,
    clearWishlist,
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
