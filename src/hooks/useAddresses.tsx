
"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { useAuth } from './useAuth';
import { database } from '@/lib/firebase';
import { ref, onValue, off, set, push, remove, update } from 'firebase/database';
import type { Address } from '@/lib/types';
import { useToast } from './use-toast';

interface AddressesContextType {
  addresses: Address[];
  loading: boolean;
  addAddress: (address: Omit<Address, 'id' | 'isDefault'>, makeDefault?: boolean) => Promise<string | null>;
  updateAddress: (addressId: string, updates: Partial<Address>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
}

const AddressesContext = createContext<AddressesContextType | undefined>(undefined);

export function AddressesProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      setLoading(true);
      const addressesRef = ref(database, `users/${user.uid}/addresses`);
      const listener = onValue(addressesRef, (snapshot) => {
        const data = snapshot.val();
        const loadedAddresses: Address[] = data 
          ? Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<Address, 'id'>) }))
          : [];
        setAddresses(loadedAddresses);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching addresses: ", error);
        toast({ title: "Error", description: "Could not fetch addresses.", variant: "destructive" });
        setAddresses([]);
        setLoading(false);
      });
      return () => off(addressesRef, listener);
    } else {
      setAddresses([]);
      setLoading(false);
    }
  }, [user, authLoading, toast]);

  const addAddress = useCallback(async (addressData: Omit<Address, 'id' | 'isDefault'>, makeDefault = false): Promise<string | null> => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to add an address.", variant: "destructive" });
      return null;
    }
    try {
      const addressesRef = ref(database, `users/${user.uid}/addresses`);
      const newAddressRef = push(addressesRef);
      const newAddressId = newAddressRef.key;
      if (!newAddressId) throw new Error("Failed to generate address ID.");

      const newAddress: Address = { 
        id: newAddressId, 
        ...addressData,
        isDefault: makeDefault || addresses.length === 0 // Make first address default
      };
      
      const updates: Record<string, any> = {};
      updates[`users/${user.uid}/addresses/${newAddressId}`] = newAddress;

      if (newAddress.isDefault) {
        addresses.forEach(addr => {
          if (addr.isDefault && addr.id !== newAddressId) {
            updates[`users/${user.uid}/addresses/${addr.id}/isDefault`] = false;
          }
        });
      }
      
      await update(ref(database), updates);
      toast({ title: "Address Added", description: "New address saved successfully." });
      return newAddressId;
    } catch (error) {
      console.error("Error adding address: ", error);
      toast({ title: "Error", description: "Could not save address.", variant: "destructive" });
      return null;
    }
  }, [user, toast, addresses]);

  const updateAddress = useCallback(async (addressId: string, addressUpdates: Partial<Address>) => {
    if (!user) {
      toast({ title: "Authentication Required", variant: "destructive" });
      return;
    }
    try {
      const addressRef = ref(database, `users/${user.uid}/addresses/${addressId}`);
      await update(addressRef, addressUpdates);
      toast({ title: "Address Updated", description: "Address updated successfully." });
    } catch (error) {
      console.error("Error updating address: ", error);
      toast({ title: "Error", description: "Could not update address.", variant: "destructive" });
    }
  }, [user, toast]);

  const deleteAddress = useCallback(async (addressId: string) => {
    if (!user) {
      toast({ title: "Authentication Required", variant: "destructive" });
      return;
    }
    try {
      const addressRef = ref(database, `users/${user.uid}/addresses/${addressId}`);
      await remove(addressRef);
      toast({ title: "Address Deleted", description: "Address removed successfully." });
    } catch (error) {
      console.error("Error deleting address: ", error);
      toast({ title: "Error", description: "Could not delete address.", variant: "destructive" });
    }
  }, [user, toast]);

  const setDefaultAddress = useCallback(async (addressId: string) => {
    if (!user) {
      toast({ title: "Authentication Required", variant: "destructive" });
      return;
    }
    try {
      const updates: Record<string, any> = {};
      addresses.forEach(addr => {
        updates[`users/${user.uid}/addresses/${addr.id}/isDefault`] = addr.id === addressId;
      });
      await update(ref(database), updates);
      toast({ title: "Default Address Set", description: "Default shipping address updated." });
    } catch (error) {
      console.error("Error setting default address: ", error);
      toast({ title: "Error", description: "Could not set default address.", variant: "destructive" });
    }
  }, [user, toast, addresses]);


  return (
    <AddressesContext.Provider value={{ addresses, loading, addAddress, updateAddress, deleteAddress, setDefaultAddress }}>
      {children}
    </AddressesContext.Provider>
  );
}

export function useAddresses() {
  const context = useContext(AddressesContext);
  if (context === undefined) {
    throw new Error('useAddresses must be used within an AddressesProvider');
  }
  return context;
}
