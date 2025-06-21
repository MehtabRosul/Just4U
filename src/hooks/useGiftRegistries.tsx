
"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { useAuth } from './useAuth';
import { database } from '@/lib/firebase';
import { ref, onValue, off, set, push, remove, update } from 'firebase/database';
import type { GiftRegistry, GiftRegistryItem } from '@/lib/types';
import { useToast } from './use-toast';

interface GiftRegistriesContextType {
  registries: GiftRegistry[];
  loading: boolean;
  createRegistry: (registryData: Omit<GiftRegistry, 'id' | 'creatorUid' | 'items'>) => Promise<string | null>;
  updateRegistryDetails: (registryId: string, updates: Partial<Omit<GiftRegistry, 'id' | 'creatorUid' | 'items'>>) => Promise<void>;
  deleteRegistry: (registryId: string) => Promise<void>;
  addRegistryItem: (registryId: string, productId: string, itemDetails: Omit<GiftRegistryItem, 'productId'>) => Promise<void>;
  updateRegistryItem: (registryId: string, productId: string, updates: Partial<GiftRegistryItem>) => Promise<void>;
  removeRegistryItem: (registryId: string, productId: string) => Promise<void>;
}

const GiftRegistriesContext = createContext<GiftRegistriesContextType | undefined>(undefined);

export function GiftRegistriesProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [registries, setRegistries] = useState<GiftRegistry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (user) {
      setLoading(true);
      const registriesRef = ref(database, `users/${user.uid}/giftRegistries`);
      const listener = onValue(registriesRef, (snapshot) => {
        const data = snapshot.val();
        const loadedRegistries: GiftRegistry[] = data
          ? Object.entries(data).map(([id, value]) => ({ 
              id, 
              ...(value as Omit<GiftRegistry, 'id'>),
              items: (value as GiftRegistry).items || {} // Ensure items is an object, even if empty
            }))
          : [];
        setRegistries(loadedRegistries);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching gift registries: ", error);
        toast({ title: "Error", description: "Could not fetch gift registries.", variant: "destructive" });
        setRegistries([]);
        setLoading(false);
      });
            return () => listener();
    } else {
      setRegistries([]);
      setLoading(false);
    }
  }, [user, authLoading, toast]);

  const createRegistry = useCallback(async (registryData: Omit<GiftRegistry, 'id' | 'creatorUid' | 'items'>): Promise<string | null> => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to create a registry.", variant: "destructive" });
      return null;
    }
    try {
      const registriesRef = ref(database, `users/${user.uid}/giftRegistries`);
      const newRegistryRef = push(registriesRef);
      const newRegistryId = newRegistryRef.key;
      if (!newRegistryId) throw new Error("Failed to generate registry ID.");

      const newRegistry: GiftRegistry = {
        id: newRegistryId,
        creatorUid: user.uid,
        items: {}, // Initialize with empty items
        ...registryData,
      };
      await set(newRegistryRef, newRegistry);
      toast({ title: "Registry Created", description: `${registryData.name} created successfully.` });
      return newRegistryId;
    } catch (error) {
      console.error("Error creating registry: ", error);
      toast({ title: "Error", description: "Could not create registry.", variant: "destructive" });
      return null;
    }
  }, [user, toast]);

  const updateRegistryDetails = useCallback(async (registryId: string, updates: Partial<Omit<GiftRegistry, 'id' | 'creatorUid' | 'items'>>) => {
    if (!user) {
      toast({ title: "Authentication Required", variant: "destructive" });
      return;
    }
    try {
      await update(ref(database, `users/${user.uid}/giftRegistries/${registryId}`), updates);
      toast({ title: "Registry Updated", description: "Registry details updated." });
    } catch (error) {
      console.error("Error updating registry details: ", error);
      toast({ title: "Error", description: "Could not update registry.", variant: "destructive" });
    }
  }, [user, toast]);

  const deleteRegistry = useCallback(async (registryId: string) => {
    if (!user) {
      toast({ title: "Authentication Required", variant: "destructive" });
      return;
    }
    try {
      await remove(ref(database, `users/${user.uid}/giftRegistries/${registryId}`));
      toast({ title: "Registry Deleted", description: "Registry removed successfully." });
    } catch (error) {
      console.error("Error deleting registry: ", error);
      toast({ title: "Error", description: "Could not delete registry.", variant: "destructive" });
    }
  }, [user, toast]);

  const addRegistryItem = useCallback(async (registryId: string, productId: string, itemDetails: Omit<GiftRegistryItem, 'productId'>) => {
    if (!user) {
      toast({ title: "Authentication Required", variant: "destructive" });
      return;
    }
    try {
      const itemRef = ref(database, `users/${user.uid}/giftRegistries/${registryId}/items/${productId}`);
      // Ensure productId is part of the item data being set
      await set(itemRef, {productId, ...itemDetails});
      toast({ title: "Item Added", description: "Item added to registry." });
    } catch (error) {
      console.error("Error adding item to registry: ", error);
      toast({ title: "Error", description: "Could not add item to registry.", variant: "destructive" });
    }
  }, [user, toast]);

  const updateRegistryItem = useCallback(async (registryId: string, productId: string, updates: Partial<GiftRegistryItem>) => {
    if (!user) {
      toast({ title: "Authentication Required", variant: "destructive" });
      return;
    }
    try {
      const itemRef = ref(database, `users/${user.uid}/giftRegistries/${registryId}/items/${productId}`);
       // Ensure 'productId' is not part of the updates object if it was accidentally included
      const { productId: pId, ...updatesWithoutProductId } = updates as GiftRegistryItem;
      await update(itemRef, updatesWithoutProductId);
      toast({ title: "Item Updated", description: "Registry item updated." });
    } catch (error) {
      console.error("Error updating registry item: ", error);
      toast({ title: "Error", description: "Could not update registry item.", variant: "destructive" });
    }
  }, [user, toast]);

  const removeRegistryItem = useCallback(async (registryId: string, productId: string) => {
    if (!user) {
      toast({ title: "Authentication Required", variant: "destructive" });
      return;
    }
    try {
      const itemRef = ref(database, `users/${user.uid}/giftRegistries/${registryId}/items/${productId}`);
      await remove(itemRef);
      toast({ title: "Item Removed", description: "Item removed from registry." });
    } catch (error) {
      console.error("Error removing item from registry: ", error);
      toast({ title: "Error", description: "Could not remove item from registry.", variant: "destructive" });
    }
  }, [user, toast]);


  return (
    <GiftRegistriesContext.Provider value={{ 
        registries, 
        loading, 
        createRegistry, 
        updateRegistryDetails, 
        deleteRegistry,
        addRegistryItem,
        updateRegistryItem,
        removeRegistryItem
    }}>
      {children}
    </GiftRegistriesContext.Provider>
  );
}

export function useGiftRegistries() {
  const context = useContext(GiftRegistriesContext);
  if (context === undefined) {
    throw new Error('useGiftRegistries must be used within a GiftRegistriesProvider');
  }
  return context;
}

