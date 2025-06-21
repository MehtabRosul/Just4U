
"use client";

import React, { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import type { Product, CartRtdbItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { database } from '@/lib/firebase';
import { ref, onValue, off, set, remove, update } from 'firebase/database';
import { PRODUCTS } from '@/lib/data'; // To enrich product details from IDs

export interface CartItem {
  product: Product; // Full product details
  quantity: number;
  addedAt?: string;
}

interface CartContextType {
  cartItems: CartItem[]; // Now stores enriched CartItem objects
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [rtdbCartItems, setRtdbCartItems] = useState<Record<string, CartRtdbItem>>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // This will be the enriched list
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Effect to fetch cart item IDs and quantities from RTDB
  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (user) {
      setLoading(true);
      const cartRef = ref(database, `users/${user.uid}/cart`);
      const listener = onValue(cartRef, (snapshot) => {
        const data = snapshot.val();
        setRtdbCartItems(data || {});
        setLoading(false);
      }, (error) => {
        console.error("Error fetching cart: ", error);
        toast({ title: "Error", description: "Could not fetch cart.", variant: "destructive" });
        setRtdbCartItems({});
        setLoading(false);
      });
      return () => off(cartRef, listener);
    } else {
      setRtdbCartItems({});
      setCartItems([]); // Clear enriched cart too
      setLoading(false);
    }
  }, [user, authLoading, toast]);

  // Effect to populate full cart item details from rtdbCartItems
  useEffect(() => {
    const enrichedCart: CartItem[] = Object.entries(rtdbCartItems)
      .map(([productId, rtdbItem]) => {
        const productDetail = PRODUCTS.find(p => p.id === productId);
        if (productDetail) {
          return {
            product: productDetail,
            quantity: rtdbItem.quantity,
            addedAt: rtdbItem.addedAt,
          };
        }
        console.warn(`[Cart] Product with ID "${productId}" not found in local data. It might be stale data from a previous session.`);
        return null;
      })
      .filter(Boolean) as CartItem[];
    setCartItems(enrichedCart);
  }, [rtdbCartItems]);


  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    if (!user) {
      setTimeout(() => {
        toast({ title: "Please Sign In", description: "You need to be signed in to add items to your cart.", variant: "destructive" });
      }, 0);
      return;
    }
    try {
      const cartItemRef = ref(database, `users/${user.uid}/cart/${product.id}`);
      const currentItem = rtdbCartItems[product.id];
      const newQuantity = currentItem ? currentItem.quantity + quantity : quantity;

      await set(cartItemRef, { 
        productId: product.id, // Storing productId for clarity, though key is the ID
        quantity: newQuantity,
        addedAt: currentItem?.addedAt || new Date().toISOString()
      });
      setTimeout(() => {
        toast({ title: currentItem ? "Item Updated" : "Added to Cart", description: `${product.name} ${currentItem ? 'quantity updated in' : 'has been added to'} your cart.` });
      }, 0);
    } catch (error) {
        console.error("Error adding to cart: ", error);
        setTimeout(() => {
            toast({ title: "Error", description: "Could not add item to cart.", variant: "destructive" });
        },0);
    }
  }, [user, toast, rtdbCartItems]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (!user) return;
    try {
      await remove(ref(database, `users/${user.uid}/cart/${productId}`));
      const product = PRODUCTS.find(p => p.id === productId);
      setTimeout(() => {
        if (product) {
          toast({ title: "Removed from Cart", description: `${product.name} has been removed from your cart.` });
        } else {
          toast({ title: "Removed from Cart", description: `Item removed from your cart.` });
        }
      }, 0);
    } catch (error) {
        console.error("Error removing from cart: ", error);
        setTimeout(() => {
            toast({ title: "Error", description: "Could not remove item from cart.", variant: "destructive" });
        },0);
    }
  }, [user, toast]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    try {
      const cartItemRef = ref(database, `users/${user.uid}/cart/${productId}`);
      // Only update quantity, preserve other fields like addedAt
      await update(cartItemRef, { quantity }); 
      
      const product = PRODUCTS.find(p => p.id === productId);
      setTimeout(() => {
        if (product) {
          toast({ title: "Quantity Updated", description: `Quantity for ${product.name} updated.` });
        }
      }, 0);
    } catch (error) {
        console.error("Error updating quantity: ", error);
        setTimeout(() => {
            toast({ title: "Error", description: "Could not update item quantity.", variant: "destructive" });
        },0);
    }
  }, [user, toast, removeFromCart]);

  const clearCart = useCallback(async () => {
    if (!user) return;
    try {
      await set(ref(database, `users/${user.uid}/cart`), null);
      setTimeout(() => {
        toast({ title: "Cart Cleared", description: "Your shopping cart has been cleared." });
      }, 0);
    } catch (error) {
      console.error("Error clearing cart: ", error);
      setTimeout(() => {
        toast({ title: "Error", description: "Could not clear cart.", variant: "destructive" });
      }, 0);
    }
  }, [user, toast]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const value: CartContextType = {
    cartItems, // Provide enriched list
    loading,
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
