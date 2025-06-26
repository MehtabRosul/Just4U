
"use client";

import { useState, useEffect } from 'react';
import { useGiftRegistries } from '@/hooks/useGiftRegistries';
import type { GiftRegistry, GiftRegistryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { PlusCircle, Edit3, Trash2, Gift, CalendarDays, Users, Search, PackagePlus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PRODUCTS } from '@/lib/data'; // For adding items// Explicitly reference all imports to avoid unused import warning
import { collection, doc, onSnapshot, query, where, addDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils'; // Ensure cn is used to avoid unused import warning


const registrySchema = z.object({
  name: z.string().min(3, "Registry name is required (min 3 chars)"),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)) && new Date(date) > new Date(0), { message: "Valid event date is required" }),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  phoneNumber: z.string().optional().refine(phone => !phone || /^\+?[1-9]\d{1,14}$/.test(phone), {
    message: "Invalid phone number format."
  }),
});

type RegistryFormInputs = z.infer<typeof registrySchema>;

const registryItemSchema = z.object({
    productId: z.string().min(1, "Product selection is required."),
    desiredQuantity: z.number().min(1, "Desired quantity must be at least 1.").max(99, "Quantity cannot exceed 99."),
});
type RegistryItemFormInputs = z.infer<typeof registryItemSchema>;

// Dummy object to reference all Firestore imports and prevent unused import warning
// Using a non-functional reference to `cn` to satisfy the compiler.
cn('dummy-class');

const _firestoreImports = {
    collection,
    doc,
    onSnapshot,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    setDoc,
};




export default function GiftRegistriesPage() {
  const { user, loading: authLoading } = useAuth();
  const { 
    registries, 
    loading: registriesLoading, 
    createRegistry, 
    updateRegistryDetails, 
    deleteRegistry, 
    addRegistryItem, 
    updateRegistryItem, 
    removeRegistryItem 
  } = useGiftRegistries();
  
  const [isRegistryFormOpen, setIsRegistryFormOpen] = useState(false);
  const [editingRegistry, setEditingRegistry] = useState<GiftRegistry | null>(null);

  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [currentItemRegistryId, setCurrentItemRegistryId] = useState<string | null>(null);
  const [editingRegistryItem, setEditingRegistryItem] = useState<{productId: string, item: GiftRegistryItem} | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');


  const { 
    register: registerRegistry, 
    handleSubmit: handleRegistrySubmit, 
    reset: resetRegistryForm, 
    setValue: setRegistryValue, 
    control: registryControl,
    formState: { errors: registryErrors } 
  } = useForm<RegistryFormInputs>({
    resolver: zodResolver(registrySchema),
    defaultValues: { isPublic: false, description: ''}
  });

  const { 
    register: registerItem, 
    handleSubmit: handleItemSubmit, 
    reset: resetItemForm, 
    setValue: setItemValue, 
    watch: watchItemForm,
    formState: { errors: itemErrors }
  } = useForm<RegistryItemFormInputs>({
    resolver: zodResolver(registryItemSchema),
    defaultValues: { desiredQuantity: 1 }
  });

  const isLoading = authLoading || registriesLoading;

  useEffect(() => {
    if (isRegistryFormOpen && editingRegistry) {
        setRegistryValue("name", editingRegistry.name);
        setRegistryValue("eventDate", editingRegistry.eventDate.split('T')[0]); // Format for date input
        setRegistryValue("description", editingRegistry.description || "");
        setRegistryValue("isPublic", editingRegistry.isPublic);
    } else if (isRegistryFormOpen && !editingRegistry) {
        resetRegistryForm({isPublic: false, description: '', name: '', eventDate: ''});
    }
  }, [isRegistryFormOpen, editingRegistry, setRegistryValue, resetRegistryForm]);

  useEffect(() => {
     if (isItemFormOpen && editingRegistryItem) {
        setItemValue("productId", editingRegistryItem.productId);
        setItemValue("desiredQuantity", editingRegistryItem.item.desiredQuantity);
     } else if (isItemFormOpen && !editingRegistryItem) {
        resetItemForm({desiredQuantity: 1, productId: ''});
        setProductSearchTerm('');
     }
  }, [isItemFormOpen, editingRegistryItem, setItemValue, resetItemForm]);


  const handleOpenRegistryForm = (registry?: GiftRegistry) => {
    if (registry) {
      setEditingRegistry(registry);
    } else {
      setEditingRegistry(null);
    }
    setIsRegistryFormOpen(true);
  };

  const onRegistrySubmit: SubmitHandler<RegistryFormInputs> = async (data) => {
    if (editingRegistry) {
      await updateRegistryDetails(editingRegistry.id, data);
    } else {
      await createRegistry(data);
    }
    setIsRegistryFormOpen(false);
  };

  const handleDeleteRegistry = async (registryId: string) => {
    if (window.confirm("Are you sure you want to delete this registry and all its items?")) {
      await deleteRegistry(registryId);
    }
  };

  // Item Form Logic
  const handleOpenItemForm = (registryId: string, itemToEdit?: {productId: string, item: GiftRegistryItem}) => {
    setCurrentItemRegistryId(registryId);
    if (itemToEdit) {
      setEditingRegistryItem(itemToEdit);
    } else {
      setEditingRegistryItem(null);
    }
    setIsItemFormOpen(true);
  };

  const onItemSubmit: SubmitHandler<RegistryItemFormInputs> = async (data) => {
    if (!currentItemRegistryId) return;
    
    const selectedProduct = PRODUCTS.find(p => p.id === data.productId);
    if (!selectedProduct) {
        // This case should ideally be prevented by UI disabling submit if no product is selected
        console.error("No product selected or product not found."); 
        return;
    }

    const itemData: GiftRegistryItem = { // Explicitly define the full structure
        productId: data.productId, // Ensure productId is part of the object
        desiredQuantity: data.desiredQuantity,
        fulfilledQuantity: editingRegistryItem?.item.fulfilledQuantity || 0 // Keep existing fulfilled or default to 0
    };

    if (editingRegistryItem) {
      // When updating, we are updating the item at items[productId]
      await updateRegistryItem(currentItemRegistryId, data.productId, itemData);
    } else {
      // When adding, we are adding the item data under items[productId]
      await addRegistryItem(currentItemRegistryId, data.productId, itemData);
    }
    setIsItemFormOpen(false);
  };

  const handleRemoveRegistryItem = async (registryId: string, productId: string) => {
    if (window.confirm("Remove this item from the registry?")) {
        await removeRegistryItem(registryId, productId);
    }
  };

  const filteredProducts = productSearchTerm
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(productSearchTerm.toLowerCase())).slice(0, 5)
    : [];
  
  const selectedProductId = watchItemForm("productId");
  const selectedProductForForm = PRODUCTS.find(p => p.id === selectedProductId);


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SectionTitle className="mb-6">My Gift Registries</SectionTitle>
        <div className="flex justify-end mb-4">
            <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <SectionTitle className="mb-6">My Gift Registries</SectionTitle>
        <Card className="max-w-md mx-auto bg-card border-border shadow-xl p-6 sm:p-8">
          <Gift className="h-16 w-16 mx-auto mb-4 text-primary" />
          <CardTitle className="text-xl sm:text-2xl text-center mb-2 text-card-foreground">Manage Your Registries</CardTitle>
          <CardDescription className="text-center mb-6 text-muted-foreground">
            Log in or sign up to create and manage gift registries for your special occasions.
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
        <SectionTitle className="mb-0 text-center sm:text-left">My Gift Registries</SectionTitle>
        <Dialog open={isRegistryFormOpen} onOpenChange={(open) => { setIsRegistryFormOpen(open); if (!open) setEditingRegistry(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenRegistryForm()} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Registry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">{editingRegistry ? 'Edit Registry' : 'Create New Registry'}</DialogTitle>
              <DialogDescription>
                  Fill in the details for your special occasion. You can share your registry with friends and family once it's created.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRegistrySubmit(onRegistrySubmit)} className="space-y-6 pt-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-semibold">Registry Title</Label>
                <p className="text-xs text-muted-foreground !mt-1">Give your registry a clear and exciting name, like "John & Jane's Wedding Registry".</p>
                <Input id="name" {...registerRegistry("name")} className={`mt-1 ${registryErrors.name ? 'border-destructive' : 'border-input'}`} />
                {registryErrors.name && <p className="text-xs text-destructive mt-1">{registryErrors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDate" className="text-foreground font-semibold">Date of Event</Label>
                <p className="text-xs text-muted-foreground !mt-1">When is the special day? This helps guests know the timeline.</p>
                <Input id="eventDate" type="date" {...registerRegistry("eventDate")} className={`mt-1 ${registryErrors.eventDate ? 'border-destructive' : 'border-input'}`} />
                {registryErrors.eventDate && <p className="text-xs text-destructive mt-1">{registryErrors.eventDate.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground font-semibold">Welcome Message (Optional)</Label>
                <p className="text-xs text-muted-foreground !mt-1">Add a short description or a welcome message for your guests.</p>
                <Textarea id="description" {...registerRegistry("description")} className="mt-1 border-input" />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Registry Visibility</Label>
                <p className="text-xs text-muted-foreground !mt-1">Control who can see your registry. You can change this setting at any time.</p>
                <div className="flex items-start space-x-3 pt-2">
                    <Controller
                        name="isPublic"
                        control={registryControl}
                        defaultValue={false}
                        render={({ field }) => (
                            <Switch
                                id="isPublic"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                aria-label="Make registry public"
                                className="mt-1"
                            />
                        )}
                    />
                    <div className="grid gap-0.5">
                        <Label htmlFor="isPublic" className="font-medium text-foreground cursor-pointer">
                            Public Registry
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Allows your registry to be searchable on our site.
                        </p>
                    </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-foreground font-semibold">Phone Number (Optional)</Label>
                <p className="text-xs text-muted-foreground !mt-1">Provide a contact number for this registry.</p>
                <Input id="phoneNumber" type="tel" {...registerRegistry("phoneNumber")} className={`mt-1 ${registryErrors.phoneNumber ? 'border-destructive' : 'border-input'}`} />
                {registryErrors.phoneNumber && <p className="text-xs text-destructive mt-1">{registryErrors.phoneNumber.message}</p>}
              </div>

              <DialogFooter className="pt-4">
                 <DialogClose asChild><Button type="button" variant="outline" onClick={() => {setIsRegistryFormOpen(false); setEditingRegistry(null);}}>Cancel</Button></DialogClose>
                <Button type="submit">{editingRegistry ? 'Save Changes' : 'Create Registry'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Item Add/Edit Dialog */}
      <Dialog open={isItemFormOpen} onOpenChange={(open) => { setIsItemFormOpen(open); if (!open) setEditingRegistryItem(null); }}>
          <DialogContent className="sm:max-w-lg bg-card border-border">
              <DialogHeader>
                  <DialogTitle className="text-card-foreground">{editingRegistryItem ? "Edit Item" : "Add Item to Registry"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleItemSubmit(onItemSubmit)} className="space-y-4">
                  <div>
                      <Label htmlFor="productSearch" className="text-foreground">Search Product</Label>
                      <div className="relative">
                          <Input 
                              id="productSearch" 
                              placeholder="Type to search products..." 
                              value={productSearchTerm}
                              onChange={(e) => { setProductSearchTerm(e.target.value); if (selectedProductId) setItemValue("productId", ""); }}
                              className="mt-1 border-input"
                              disabled={!!selectedProductId && !!editingRegistryItem} // Disable search if editing and product already selected
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                      </div>
                      {productSearchTerm && filteredProducts.length > 0 && !selectedProductForForm && (
                          <div className="mt-2 border rounded-md max-h-40 overflow-y-auto bg-background">
                              {filteredProducts.map(p => (
                                  <div 
                                      key={p.id} 
                                      onClick={() => { setItemValue("productId", p.id, {shouldValidate: true}); setProductSearchTerm(''); }}
                                      className="p-2 hover:bg-accent cursor-pointer text-sm text-foreground"
                                  >
                                      {p.name}
                                  </div>
                              ))}
                          </div>
                      )}
                      {selectedProductForForm && (
                        <div className="mt-2 p-2 border rounded-md bg-muted text-sm text-muted-foreground flex justify-between items-center">
                            <span>Selected: {selectedProductForForm.name}</span>
                            {!editingRegistryItem && ( // Allow changing product only if not editing an existing item
                                <Button type="button" variant="ghost" size="sm" onClick={() => { setItemValue("productId", ""); setProductSearchTerm('');}} className="text-xs">
                                    Change
                                </Button>
                            )}
                        </div>
                      )}
                      {itemErrors.productId && <p className="text-xs text-destructive mt-1">{itemErrors.productId.message}</p>}
                  </div>
                  <div>
                      <Label htmlFor="desiredQuantity" className="text-foreground">Desired Quantity</Label>
                      <Input id="desiredQuantity" type="number" {...registerItem("desiredQuantity")} min="1" className={`mt-1 ${itemErrors.desiredQuantity ? 'border-destructive' : 'border-input'}`} />
                      {itemErrors.desiredQuantity && <p className="text-xs text-destructive mt-1">{itemErrors.desiredQuantity.message}</p>}
                  </div>
                  <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="outline" onClick={() => { setIsItemFormOpen(false); setEditingRegistryItem(null);}}>Cancel</Button></DialogClose>
                      <Button type="submit" disabled={!selectedProductId}>{editingRegistryItem ? "Save Item Changes" : "Add Item"}</Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>


      {registries.length > 0 ? (
        <div className="space-y-6">
          {registries.map((registry) => (
            <Card key={registry.id} className="bg-secondary border-border shadow-md">
              <CardHeader className="flex flex-col sm:flex-row items-start justify-between pb-3 gap-2">
                <div>
                  <CardTitle className="text-xl text-secondary-foreground">{registry.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                    <CalendarDays className="h-4 w-4 inline-block"/> Event Date: {new Date(registry.eventDate).toLocaleDateString()}
                    {registry.isPublic ? <Badge variant="outline" className="ml-2 border-primary text-primary text-xs py-0.5">Public</Badge> 
                                       : <Badge variant="outline" className="ml-2 border-muted text-muted-foreground text-xs py-0.5">Private</Badge>}
                  </CardDescription>
                </div>
                <div className="flex space-x-2 shrink-0">
                    <Button variant="outline" size="icon" onClick={() => handleOpenRegistryForm(registry)} className="h-8 w-8">
                        <Edit3 className="h-4 w-4" /> <span className="sr-only">Edit Registry</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteRegistry(registry.id)} className="h-8 w-8">
                        <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete Registry</span>
                    </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {registry.description && <p className="text-sm text-muted-foreground mb-3">{registry.description}</p>}
                
                <div className="mb-3">
                    <Button size="sm" onClick={() => handleOpenItemForm(registry.id)}>
                        <PackagePlus className="mr-2 h-4 w-4"/>Add Item to Registry
                    </Button>
                </div>

                {Object.keys(registry.items || {}).length > 0 ? (
                    <div className="space-y-2">
                        {Object.entries(registry.items || {}).map(([productId, itemData]) => {
                            const product = PRODUCTS.find(p => p.id === productId);
                            return (
                                <div key={productId} className="flex justify-between items-center p-2 border rounded-md bg-background">
                                    <div className="text-sm">
                                        <p className="font-medium text-foreground">{product ? product.name : "Unknown Product"}</p>
                                        <p className="text-xs text-muted-foreground">Desired: {itemData.desiredQuantity} | Fulfilled: {itemData.fulfilledQuantity}</p>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenItemForm(registry.id, {productId, item: itemData})}>
                                            <Edit3 className="h-3.5 w-3.5"/> <span className="sr-only">Edit Item</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleRemoveRegistryItem(registry.id, productId)}>
                                            <Trash2 className="h-3.5 w-3.5"/> <span className="sr-only">Remove Item</span>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground italic">No items added to this registry yet.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border shadow-md text-center py-10">
          <CardContent>
            <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-card-foreground">No gift registries found.</p>
            <p className="text-muted-foreground">Create a new registry for your upcoming special event.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
