
"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { useAuth } from './useAuth';
import { database } from '@/lib/firebase';
import { ref, onValue, off, set, push } from 'firebase/database';
import type { Order } from '@/lib/types';
import { useToast } from './use-toast';

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  // addOrder: (orderData: Omit<Order, 'id'>) => Promise<string | null>; // Full order creation is complex
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      setLoading(true);
      const ordersRef = ref(database, `users/${user.uid}/orders`);
      const listener = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        const loadedOrders: Order[] = data 
          ? Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<Order, 'id'>) }))
          : [];
        setOrders(loadedOrders.sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())); // Sort by newest first
        setLoading(false);
      }, (error) => {
        console.error("Error fetching orders: ", error);
        toast({ title: "Error", description: "Could not fetch order history.", variant: "destructive" });
        setOrders([]);
        setLoading(false);
      });
      return () => off(ordersRef, listener);
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user, authLoading, toast]);

  // Basic addOrder (example, full implementation is more complex)
  // const addOrder = useCallback(async (orderData: Omit<Order, 'id'>): Promise<string | null> => {
  //   if (!user) {
  //     toast({ title: "Authentication Required", variant: "destructive" });
  //     return null;
  //   }
  //   try {
  //     const ordersRef = ref(database, `users/${user.uid}/orders`);
  //     const newOrderRef = push(ordersRef);
  //     const newOrderId = newOrderRef.key;
  //     if (!newOrderId) throw new Error("Failed to generate order ID.");

  //     const newOrder: Order = {
  //       id: newOrderId,
  //       ...orderData,
  //     };
  //     await set(newOrderRef, newOrder);
  //     toast({ title: "Order Placed", description: "Your order has been placed successfully." });
  //     return newOrderId;
  //   } catch (error) {
  //     console.error("Error placing order: ", error);
  //     toast({ title: "Error", description: "Could not place order.", variant: "destructive" });
  //     return null;
  //   }
  // }, [user, toast]);

  return (
    <OrdersContext.Provider value={{ orders, loading }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
