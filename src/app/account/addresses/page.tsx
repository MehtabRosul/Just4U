
"use client";

import { useState, useEffect } from 'react';
import { useAddresses } from '@/hooks/useAddresses';
import type { Address } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { PlusCircle, Edit3, Trash2, Home, Briefcase, Star, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code is required").max(10),
  country: z.string().min(2, "Country is required"),
});

type AddressFormInputs = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const { user, loading: authLoading } = useAuth();
  const { addresses, loading: addressesLoading, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AddressFormInputs>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "India" } // Default country
  });

  const isLoading = authLoading || addressesLoading;

  useEffect(() => {
    // If the form is opened for editing, populate it
    if (isFormOpen && editingAddress) {
      setValue("label", editingAddress.label);
      setValue("street", editingAddress.street);
      setValue("city", editingAddress.city);
      setValue("state", editingAddress.state);
      setValue("zip", editingAddress.zip);
      setValue("country", editingAddress.country);
    } else if (isFormOpen && !editingAddress) {
      // If form is opened for new address, reset to defaults
      reset({ country: "India", label: "", street: "", city: "", state: "", zip: "" });
    }
  }, [isFormOpen, editingAddress, setValue, reset]);

  const handleOpenForm = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
    } else {
      setEditingAddress(null);
    }
    setIsFormOpen(true);
  };

  const onSubmit: SubmitHandler<AddressFormInputs> = async (data) => {
    if (editingAddress) {
      await updateAddress(editingAddress.id, data);
    } else {
      // For new addresses, determine if it should be the default
      const makeDefault = addresses.length === 0;
      await addAddress(data, makeDefault);
    }
    setIsFormOpen(false); // This will trigger useEffect to reset or clear form state
  };
  
  const handleDeleteAddress = async (addressId: string) => {
    // Consider adding a confirmation dialog here
    if (window.confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(addressId);
    }
  };

  if (isLoading) { // Generic loading skeleton for auth or addresses
    return (
        <div className="container mx-auto px-4 py-8">
            <SectionTitle className="mb-6">Manage Addresses</SectionTitle>
            <div className="flex justify-end mb-4">
                 <Skeleton className="h-10 w-40" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
            </div>
        </div>
    );
  }

  if (!user && !authLoading) { // User explicitly not logged in (auth has finished loading)
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <SectionTitle className="mb-6">Manage Addresses</SectionTitle>
        <Card className="max-w-md mx-auto bg-card border-border shadow-xl p-6 sm:p-8">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-primary" />
            <CardTitle className="text-xl sm:text-2xl text-center mb-2 text-card-foreground">Access Your Addresses</CardTitle>
            <CardDescription className="text-center mb-6 text-muted-foreground">
                Please log in or sign up to manage your shipping addresses.
            </CardDescription>
            <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/auth">Login / Sign Up</Link>
            </Button>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <SectionTitle className="mb-0 text-center sm:text-left">Manage Addresses</SectionTitle>
        <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingAddress(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="label" className="text-foreground">Label (e.g., Home, Work)</Label>
                <Input id="label" {...register("label")} className={`mt-1 ${errors.label ? 'border-destructive' : 'border-input'}`} />
                {errors.label && <p className="text-xs text-destructive mt-1">{errors.label.message}</p>}
              </div>
              <div>
                <Label htmlFor="street" className="text-foreground">Street Address</Label>
                <Input id="street" {...register("street")} className={`mt-1 ${errors.street ? 'border-destructive' : 'border-input'}`} />
                {errors.street && <p className="text-xs text-destructive mt-1">{errors.street.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-foreground">City</Label>
                  <Input id="city" {...register("city")} className={`mt-1 ${errors.city ? 'border-destructive' : 'border-input'}`} />
                  {errors.city && <p className="text-xs text-destructive mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <Label htmlFor="state" className="text-foreground">State/Province</Label>
                  <Input id="state" {...register("state")} className={`mt-1 ${errors.state ? 'border-destructive' : 'border-input'}`} />
                  {errors.state && <p className="text-xs text-destructive mt-1">{errors.state.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip" className="text-foreground">ZIP/Postal Code</Label>
                  <Input id="zip" {...register("zip")} className={`mt-1 ${errors.zip ? 'border-destructive' : 'border-input'}`} />
                  {errors.zip && <p className="text-xs text-destructive mt-1">{errors.zip.message}</p>}
                </div>
                <div>
                  <Label htmlFor="country" className="text-foreground">Country</Label>
                  <Input id="country" {...register("country")} className={`mt-1 ${errors.country ? 'border-destructive' : 'border-input'}`} />
                  {errors.country && <p className="text-xs text-destructive mt-1">{errors.country.message}</p>}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => { setIsFormOpen(false); setEditingAddress(null); }}>Cancel</Button>
                </DialogClose>
                <Button type="submit">{editingAddress ? 'Save Changes' : 'Add Address'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className={cn("bg-secondary border-border shadow-md", address.isDefault && "border-primary ring-2 ring-primary")}>
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex items-center">
                    {address.label.toLowerCase().includes('home') ? <Home className="h-5 w-5 mr-2 text-primary" /> : 
                     address.label.toLowerCase().includes('work') || address.label.toLowerCase().includes('office') ? <Briefcase className="h-5 w-5 mr-2 text-primary" /> :
                     <MapPin className="h-5 w-5 mr-2 text-primary" />
                    }
                    <CardTitle className="text-lg text-secondary-foreground">{address.label}</CardTitle>
                </div>
                {address.isDefault && (
                  <div className="flex items-center text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 mr-1 fill-primary" /> Default
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground pt-0">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zip}</p>
                <p>{address.country}</p>
                <div className="flex space-x-2 pt-3">
                  <Button variant="outline" size="sm" onClick={() => handleOpenForm(address)} className="text-xs">
                    <Edit3 className="mr-1 h-3 w-3" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteAddress(address.id)} className="text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs">
                    <Trash2 className="mr-1 h-3 w-3" /> Delete
                  </Button>
                  {!address.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => setDefaultAddress(address.id)} className="text-xs">
                      <Star className="mr-1 h-3 w-3" /> Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border shadow-md text-center py-10">
          <CardContent>
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-card-foreground">No addresses saved yet.</p>
            <p className="text-muted-foreground">Add your shipping addresses for faster checkout.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

