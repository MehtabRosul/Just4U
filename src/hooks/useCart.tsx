
"use client";

import React, { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY_BASE = 'just4ugifts_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const getCartStorageKey = useCallback(() => {
    return user ? `${CART_STORAGE_KEY_BASE}_${user.uid}` : null;
  }, [user]);

  const loadCartForUser = useCallback((userId: string) => {
    try {
      const storageKey = `${CART_STORAGE_KEY_BASE}_${userId}`;
      const storedCart = localStorage.getItem(storageKey);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage for user", userId, error);
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadCartForUser(user.uid);
      } else {
        setCartItems([]); // Clear cart if no user
      }
    }
  }, [user, authLoading, loadCartForUser]);

  useEffect(() => {
    const storageKey = getCartStorageKey();
    if (storageKey) { // Only save if user is logged in
      try {
        localStorage.setItem(storageKey, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to localStorage", error);
      }
    }
    // If user logs out, cartItems is cleared by the effect above,
    // and this effect will then save an empty array for that user's last key if it was set.
    // Or if storageKey becomes null (logged out), nothing is saved.
  }, [cartItems, getCartStorageKey]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    if (!user) {
      setTimeout(() => {
        toast({
          title: "Please Sign In",
          description: "You need to be signed in to add items to your cart.",
          variant: "destructive"
        });
      }, 0);
      return;
    }
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        setTimeout(() => {
          toast({ title: "Item Updated", description: `${product.name} quantity updated in your cart.` });
        }, 0);
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        setTimeout(() => {
          toast({ title: "Added to Cart", description: `${product.name} has been added to your cart.` });
        }, 0);
        return [...prevItems, { product, quantity }];
      }
    });
  }, [user, toast]);

  const removeFromCart = useCallback((productId: string) => {
    if (!user) return;
    setCartItems((prevItems) => {
      const productToRemove = prevItems.find(item => item.product.id === productId);
      if (productToRemove) {
        setTimeout(() => {
          toast({ title: "Removed from Cart", description: `${productToRemove.product.name} has been removed from your cart.` });
        }, 0);
      }
      return prevItems.filter(item => item.product.id !== productId);
    });
  }, [user, toast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) => {
      setTimeout(() => {
        const product = prevItems.find(item => item.product.id === productId)?.product;
        if (product) {
          toast({ title: "Quantity Updated", description: `Quantity for ${product.name} updated.` });
        }
      }, 0);
      return prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  }, [user, toast, removeFromCart]);

  const clearCart = useCallback(() => {
    if (!user) return;
    setCartItems([]);
    setTimeout(() => {
      toast({ title: "Cart Cleared", description: "Your shopping cart has been cleared." });
    }, 0);
    // localStorage removal for the user's cart will be handled by the useEffect watching cartItems
  }, [user, toast]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);


  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
