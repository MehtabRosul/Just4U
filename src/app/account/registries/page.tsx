
"use client";

import { useState } from 'react';
import { useGiftRegistries } from '@/hooks/useGiftRegistries';
import type { GiftRegistry, GiftRegistryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { PlusCircle, Edit3, Trash2, Gift, CalendarDays, Users, Search, PackagePlus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PRODUCTS } from '@/lib/data'; // For adding items

const registrySchema = z.object({
  name: z.string().min(3, "Registry name is required (min 3 chars)"),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
});

type RegistryFormInputs = z.infer<typeof registrySchema>;

const registryItemSchema = z.object({
    productId: z.string().min(1, "Product selection is required."),
    desiredQuantity: z.number().min(1, "Desired quantity must be at least 1."),
});
type RegistryItemFormInputs = z.infer<typeof registryItemSchema>;


export default function GiftRegistriesPage() {
  const { user, loading: authLoading } = useAuth();
  const { registries, loading: registriesLoading, createRegistry, updateRegistryDetails, deleteRegistry, addRegistryItem, updateRegistryItem, removeRegistryItem } = useGiftRegistries();
  
  const [isRegistryFormOpen, setIsRegistryFormOpen] = useState(false);
  const [editingRegistry, setEditingRegistry] = useState<GiftRegistry | null>(null);

  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [currentItemRegistryId, setCurrentItemRegistryId] = useState<string | null>(null);
  const [editingRegistryItem, setEditingRegistryItem] = useState<{productId: string, item: GiftRegistryItem} | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');


  const { register: registerRegistry, handleSubmit: handleRegistrySubmit, reset: resetRegistryForm, setValue: setRegistryValue, control: registryControl } = useForm<RegistryFormInputs>({
    resolver: zodResolver(registrySchema),
  });

  const { register: registerItem, handleSubmit: handleItemSubmit, reset: resetItemForm, setValue: setItemValue, watch: watchItemForm } = useForm<RegistryItemFormInputs>({
    resolver: zodResolver(registryItemSchema),
    defaultValues: { desiredQuantity: 1 }
  });

  const isLoading = authLoading || registriesLoading;

  const handleOpenRegistryForm = (registry?: GiftRegistry) => {
    resetRegistryForm();
    if (registry) {
      setEditingRegistry(registry);
      setRegistryValue("name", registry.name);
      setRegistryValue("eventDate", registry.eventDate.split('T')[0]); // Format for date input
      setRegistryValue("description", registry.description || "");
      setRegistryValue("isPublic", registry.isPublic);
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
    resetRegistryForm();
  };

  const handleDeleteRegistry = async (registryId: string) => {
    if (window.confirm("Are you sure you want to delete this registry and all its items?")) {
      await deleteRegistry(registryId);
    }
  };

  // Item Form Logic
  const handleOpenItemForm = (registryId: string, itemToEdit?: {productId: string, item: GiftRegistryItem}) => {
    resetItemForm({desiredQuantity: 1}); // Reset with default quantity
    setCurrentItemRegistryId(registryId);
    setProductSearchTerm(''); // Clear search term
    if (itemToEdit) {
      setEditingRegistryItem(itemToEdit);
      setItemValue("productId", itemToEdit.productId);
      setItemValue("desiredQuantity", itemToEdit.item.desiredQuantity);
    } else {
      setEditingRegistryItem(null);
    }
    setIsItemFormOpen(true);
  };

  const onItemSubmit: SubmitHandler<RegistryItemFormInputs> = async (data) => {
    if (!currentItemRegistryId) return;
    const itemData: Omit<GiftRegistryItem, 'productId'> = {
        desiredQuantity: data.desiredQuantity,
        fulfilledQuantity: editingRegistryItem?.item.fulfilledQuantity || 0
    };

    if (editingRegistryItem) {
      await updateRegistryItem(currentItemRegistryId, data.productId, itemData);
    } else {
      await addRegistryItem(currentItemRegistryId, data.productId, itemData);
    }
    setIsItemFormOpen(false);
    resetItemForm({desiredQuantity: 1});
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


  if (isLoading && !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SectionTitle className="mb-6">My Gift Registries</SectionTitle>
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4 mb-4" />
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
        <Dialog open={isRegistryFormOpen} onOpenChange={setIsRegistryFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenRegistryForm()} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Registry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">{editingRegistry ? 'Edit Registry' : 'Create New Registry'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRegistrySubmit(onRegistrySubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground">Registry Name</Label>
                <Input id="name" {...registerRegistry("name")} className={`mt-1 ${errors.name ? 'border-destructive' : 'border-input'}`} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="eventDate" className="text-foreground">Event Date</Label>
                <Input id="eventDate" type="date" {...registerRegistry("eventDate")} className={`mt-1 ${errors.eventDate ? 'border-destructive' : 'border-input'}`} />
                {errors.eventDate && <p className="text-xs text-destructive mt-1">{errors.eventDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="description" className="text-foreground">Description (Optional)</Label>
                <Textarea id="description" {...registerRegistry("description")} className="mt-1 border-input" />
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                    name="isPublic"
                    control={registryControl}
                    render={({ field }) => (
                        <Switch
                            id="isPublic"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
                <Label htmlFor="isPublic" className="text-foreground">Make Registry Public</Label>
              </div>
              <DialogFooter>
                 <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit">{editingRegistry ? 'Save Changes' : 'Create Registry'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Item Add/Edit Dialog */}
      <Dialog open={isItemFormOpen} onOpenChange={setIsItemFormOpen}>
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
                              onChange={(e) => setProductSearchTerm(e.target.value)}
                              className="mt-1 border-input"
                          />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                      </div>
                      {productSearchTerm && filteredProducts.length > 0 && (
                          <div className="mt-2 border rounded-md max-h-40 overflow-y-auto bg-background">
                              {filteredProducts.map(p => (
                                  <div 
                                      key={p.id} 
                                      onClick={() => { setItemValue("productId", p.id); setProductSearchTerm(''); }}
                                      className="p-2 hover:bg-accent cursor-pointer text-sm text-foreground"
                                  >
                                      {p.name}
                                  </div>
                              ))}
                          </div>
                      )}
                      {selectedProductForForm && (
                        <div className="mt-2 p-2 border rounded-md bg-muted text-sm text-muted-foreground">
                            Selected: {selectedProductForForm.name}
                        </div>
                      )}
                      {errors.productId && <p className="text-xs text-destructive mt-1">{errors.productId.message}</p>}
                  </div>
                  <div>
                      <Label htmlFor="desiredQuantity" className="text-foreground">Desired Quantity</Label>
                      <Input id="desiredQuantity" type="number" {...registerItem("desiredQuantity")} min="1" className={`mt-1 ${errors.desiredQuantity ? 'border-destructive' : 'border-input'}`} />
                      {errors.desiredQuantity && <p className="text-xs text-destructive mt-1">{errors.desiredQuantity.message}</p>}
                  </div>
                  <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                      <Button type="submit">{editingRegistryItem ? "Save Item Changes" : "Add Item"}</Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>


      {registriesLoading ? (
         <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      ) : registries.length > 0 ? (
        <div className="space-y-6">
          {registries.map((registry) => (
            <Card key={registry.id} className="bg-secondary border-border shadow-md">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div>
                  <CardTitle className="text-xl text-secondary-foreground">{registry.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Event Date: {new Date(registry.eventDate).toLocaleDateString()}
                    {registry.isPublic && <Badge variant="outline" className="ml-2 border-primary text-primary text-xs">Public</Badge>}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenRegistryForm(registry)} className="h-8 w-8">
                        <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteRegistry(registry.id)} className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
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
                        {Object.entries(registry.items).map(([productId, itemData]) => {
                            const product = PRODUCTS.find(p => p.id === productId);
                            return (
                                <div key={productId} className="flex justify-between items-center p-2 border rounded-md bg-background">
                                    <div className="text-sm">
                                        <p className="font-medium text-foreground">{product ? product.name : "Unknown Product"}</p>
                                        <p className="text-xs text-muted-foreground">Desired: {itemData.desiredQuantity} | Fulfilled: {itemData.fulfilledQuantity}</p>
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenItemForm(registry.id, {productId, item: itemData})}>
                                            <Edit3 className="h-3.5 w-3.5"/>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleRemoveRegistryItem(registry.id, productId)}>
                                            <Trash2 className="h-3.5 w-3.5"/>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No items added to this registry yet.</p>
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

