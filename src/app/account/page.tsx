
"use client";

import { useState, useEffect, type ChangeEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ShoppingBag, Heart, Gift, MapPin as MapPinIconLucide, Bell, LogOut, User as UserIcon, Edit3, Camera, CheckCircle,
  PlusCircle, Home, Briefcase, Star, Trash2, ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';
import type { UserProfileDetails, Address } from '@/lib/types';
import { useAddresses } from '@/hooks/useAddresses';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from '@/components/ui/separator';

const accountSections = [
  { title: 'My Orders', description: 'View your order history and track shipments.', icon: ShoppingBag, href: '/account/orders' },
  { title: 'My Cart', description: 'View and manage items in your shopping cart.', icon: ShoppingCart, href: '/cart' },
  { title: 'My Wishlist', description: 'See your saved favorite items.', icon: Heart, href: '/wishlist' },
  { title: 'Address Book', description: 'Manage your shipping addresses.', icon: MapPinIconLucide, href: '/account/addresses' },
  { title: 'Gift Registries', description: 'Manage your gift registries for special occasions.', icon: Gift, href: '/account/registries' },
  { title: 'Notifications', description: 'Manage your notification preferences.', icon: Bell, href: '#' }, // Placeholder for now
];

const predefinedAvatarUrls = [
  { url: 'https://i.ibb.co/rfz6Rp2G/pngwing-com-1.png', hint: 'avatar photo' },
  { url: 'https://i.ibb.co/Q7NFQ2fG/pngwing-com-2.png', hint: 'avatar photo' },
  { url: 'https://i.ibb.co/HTYVB3WB/pngwing-com-3.png', hint: 'avatar photo' },
  { url: 'https://i.ibb.co/xqpmp7Y9/pngwing-com-4.png', hint: 'avatar photo' },
  { url: 'https://i.ibb.co/zV31ct4n/pngwing-com-5.png', hint: 'avatar photo' },
  { url: 'https://i.ibb.co/XkzgCcQF/pngwing-com-6.png', hint: 'avatar photo' },
  { url: 'https://i.ibb.co/bD9h08h/pngwing-com-7.png', hint: 'avatar photo' },
  { url: 'https://i.ibb.co/rJ1sq46/pngwing-com-9.png', hint: 'avatar photo' },
  { url: 'https://i.ibb.co/Z6Mpd527/pngwing-com-10.png', hint: 'avatar photo' },
  { url: 'https://i.ibb.co/xSYh7h9H/pngwing-com-11.png', hint: 'avatar photo' }
];

// Address Form Schema with enhanced validation
const addressSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  street: z.string().trim().min(3, "Street address is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  zip: z.string().regex(/^\d{5,10}$/, "Invalid ZIP code (must be 5-10 digits)").min(5, "ZIP code is required"),
  country: z.string().trim().min(2, "Country is required"),
  phoneNumber: z.string().trim()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (e.g., +911234567890 or 1234567890)")
    .min(10, "Phone number must be at least 10 digits")
    .optional(),
});
type AddressFormInputs = z.infer<typeof addressSchema>;


export default function AccountPage() {
  const { 
    user, 
    loading: authLoading, 
    signOutUser, 
    updateUserFirebaseProfile,
    profileDetails, 
    loadingProfileDetails,
    saveUserProfileDetails 
  } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Local state for profile form inputs
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  // Address Management State and Hooks
  const { 
    addresses, 
    loading: addressesLoading, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
  } = useAddresses();
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { 
    register: registerAddress, 
    handleSubmit: handleAddressSubmit, 
    reset: resetAddressForm, 
    setValue: setAddressValue, 
    formState: { errors: addressErrors } 
  } = useForm<AddressFormInputs>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "India", phoneNumber: "" }
  });

  useEffect(() => {
    if (user && !authLoading) {
      setDisplayName(user.displayName || '');
      setPhotoPreview(user.photoURL || null); 

      if (profileDetails && !loadingProfileDetails) {
        setPhoneNumber(profileDetails.phoneNumber || '');
        setAge(profileDetails.age || '');
      } else if (!loadingProfileDetails) { 
        setPhoneNumber('');
        setAge('');
      }
    } else if (!user && !authLoading) { 
      setDisplayName('');
      setPhoneNumber('');
      setAge('');
      setPhotoPreview(null);
      if (isEditing) setIsEditing(false); 
    }
  }, [user, authLoading, profileDetails, loadingProfileDetails, isEditing]);

  // Effect for address form population
  useEffect(() => {
    if (isAddressFormOpen && editingAddress) {
      setAddressValue("label", editingAddress.label);
      setAddressValue("street", editingAddress.street);
      setAddressValue("city", editingAddress.city);
      setAddressValue("state", editingAddress.state);
      setAddressValue("zip", editingAddress.zip);
      setAddressValue("country", editingAddress.country);
      setAddressValue("phoneNumber", editingAddress.phoneNumber || "");
    } else if (isAddressFormOpen && !editingAddress) {
      resetAddressForm({ country: "India", label: "", street: "", city: "", state: "", zip: "", phoneNumber: "" });
    }
  }, [isAddressFormOpen, editingAddress, setAddressValue, resetAddressForm]);


  const handleProfileSave = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save your profile.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const authProfileUpdate: { displayName?: string; photoURL?: string } = {};
      const currentAuthDisplayName = user.displayName || '';
      const currentAuthPhotoURL = user.photoURL || null;

      if (displayName !== currentAuthDisplayName) {
        authProfileUpdate.displayName = displayName;
      }
      if (photoPreview !== currentAuthPhotoURL) {
        authProfileUpdate.photoURL = photoPreview === null ? "" : photoPreview;
      }
      
      if (Object.keys(authProfileUpdate).length > 0) {
        await updateUserFirebaseProfile(user, authProfileUpdate);
      }
      
      const currentRtdbPhoneNumber = profileDetails?.phoneNumber || '';
      const currentRtdbAge = profileDetails?.age || '';
      
      if (phoneNumber !== currentRtdbPhoneNumber || age !== currentRtdbAge) {
          const detailsToSave: UserProfileDetails = { phoneNumber, age };
          await saveUserProfileDetails(user.uid, detailsToSave);
      }
      
      toast({ title: "Profile Updated", description: "Your profile details have been updated." });
      setIsEditing(false); 
      
    } catch (error) {
      const e = error as Error;
      toast({ title: "Update Failed", description: e.message || "Could not update profile.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleEditToggle = async () => {
    if (isEditing) { 
      await handleProfileSave(); 
    } else {
      if (user) {
        setDisplayName(user.displayName || '');
        setPhotoPreview(user.photoURL || null); 
        if (profileDetails) {
            setPhoneNumber(profileDetails.phoneNumber || '');
            setAge(profileDetails.age || '');
        } else {
            setPhoneNumber('');
            setAge('');
        }
      }
      setIsEditing(true);
    }
  };

  const handleAvatarSelect = (url: string) => {
    setPhotoPreview(url);
    setIsAvatarDialogOpen(false);
  };
  
  const handleSignOut = async () => {
    const success = await signOutUser();
    if (success) {
      router.push('/'); 
    }
  }

  // Address Form Handlers
  const handleOpenAddressForm = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
    } else {
      setEditingAddress(null);
    }
    setIsAddressFormOpen(true);
  };

  const onAddressSubmit: SubmitHandler<AddressFormInputs> = async (data) => {
    if (editingAddress) {
      await updateAddress(editingAddress.id, data);
    } else {
      const makeDefault = addresses.length === 0;
      await addAddress(data, makeDefault);
    }
    setIsAddressFormOpen(false); 
  };
  
  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(addressId);
    }
  };

  // Main skeleton shown while Firebase Auth is initializing
  if (authLoading) { 
    return (
      <div className="container mx-auto px-4 py-8">
        <SectionTitle className="mb-8 text-center sm:text-left">My Account</SectionTitle>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-card border-border shadow-md">
              <CardHeader className="items-center pb-4">
                <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto mt-3" />
                <Skeleton className="h-3 w-full mx-auto mt-1" />
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
             <Card className="bg-card border-border shadow-md">
                <CardHeader>
                    <Skeleton className="h-6 w-1/2 mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  {[...Array(accountSections.length)].map((_, i) => (
                      <Skeleton key={i} className="h-[100px] rounded-lg" />
                  ))}
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  // If Auth is loaded but no user, show login prompt
  if (!user) { 
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <SectionTitle className="mb-6">My Account</SectionTitle>
        <Card className="max-w-md mx-auto bg-card border-border shadow-xl p-6 sm:p-8">
            <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarFallback>
                    <UserIcon className="h-10 w-10 text-muted-foreground" />
                </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl sm:text-2xl text-center mb-2 text-card-foreground">Welcome, Guest</CardTitle>
            <CardDescription className="text-center mb-6 text-muted-foreground">
                Please log in or sign up to access your account and manage your profile.
            </CardDescription>
            <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/auth">Login / Sign Up</Link>
            </Button>
        </Card>
      </div>
    );
  }

  const effectiveDisplayName = user.displayName || user.email || 'User';
  const effectiveEmail = user.email || 'user@example.com';
  const avatarDisplaySrc = isEditing ? photoPreview : (user.photoURL || null);

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle className="mb-8 text-center sm:text-left">My Account</SectionTitle>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card border-border shadow-md">
              <CardHeader className="items-center text-center pb-4">
                <div className="relative group">
                    <Avatar className="h-24 w-24 mx-auto">
                      <AvatarImage src={avatarDisplaySrc || undefined} alt={effectiveDisplayName} />
                      <AvatarFallback>
                        {effectiveDisplayName ? effectiveDisplayName.charAt(0).toUpperCase() : <UserIcon className="h-10 w-10" />}
                      </AvatarFallback>
                    </Avatar>
                  {isEditing && (
                    <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          type="button" 
                          size="icon" 
                          variant="outline" 
                          className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background/80 hover:bg-background border-primary text-primary"
                        >
                          <Camera className="h-4 w-4" />
                          <span className="sr-only">Change photo</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-card border-border">
                        <DialogHeader>
                          <DialogTitle className="text-card-foreground">Select Avatar</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-5 gap-3 p-4 max-h-[300px] overflow-y-auto">
                          {predefinedAvatarUrls.map((avatar) => (
                            <button
                              key={avatar.url}
                              type="button"
                              onClick={() => handleAvatarSelect(avatar.url)}
                              className={cn(
                                "rounded-full overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                photoPreview === avatar.url ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent hover:border-muted"
                              )}
                            >
                              <Image
                                src={avatar.url}
                                alt={avatar.hint}
                                width={60}
                                height={60}
                                className="object-cover"
                                data-ai-hint={avatar.hint}
                              />
                            </button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                
                {isEditing ? (
                  <Input
                    id="displayName"
                    value={displayName} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                    className="text-xl font-semibold text-center mt-3 bg-input border-border focus:ring-primary text-foreground"
                    placeholder="Your Name"
                  />
                ) : (
                  <CardTitle className="text-xl text-center mt-3 text-card-foreground">
                    {user.displayName || effectiveEmail}
                  </CardTitle>
                )}
                 <CardDescription className="text-sm text-center text-muted-foreground">
                  {effectiveEmail}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                {isEditing && (
                  <>
                    <div>
                      <Label htmlFor="phoneNumber" className="text-xs text-muted-foreground">Phone Number</Label>
                      {loadingProfileDetails ? <Skeleton className="h-10 w-full mt-1" /> :
                        <Input
                          id="phoneNumber"
                          type="tel"
                          value={phoneNumber} 
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                          placeholder="Your phone number"
                          className="mt-1 bg-input border-border focus:ring-primary text-foreground"
                        />
                      }
                    </div>
                     <div>
                      <Label htmlFor="age" className="text-xs text-muted-foreground">Age</Label>
                      {loadingProfileDetails ? <Skeleton className="h-10 w-full mt-1" /> :
                        <Input
                          id="age"
                          type="number"
                          value={age} 
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
                          placeholder="Your age"
                          className="mt-1 bg-input border-border focus:ring-primary text-foreground"
                        />
                      }
                    </div>

                    <Separator className="my-4 bg-border" />
                    
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium text-muted-foreground">Shipping Addresses</Label>
                            <Dialog open={isAddressFormOpen} onOpenChange={(open) => { setIsAddressFormOpen(open); if (!open) setEditingAddress(null); }}>
                              <DialogTrigger asChild>
                                <Button variant="secondary" size="sm" onClick={() => handleOpenAddressForm()} className="text-xs">
                                  <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Add Address
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md bg-card border-border">
                                <DialogHeader>
                                  <DialogTitle className="text-primary">{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="space-y-4">
                                  <div>
                                    <Label htmlFor="addr-label" className="text-card-foreground">Address Label</Label>
                                    <Input 
                                      id="addr-label" 
                                      {...registerAddress("label")} 
                                      placeholder="E.g. Home, Work"
                                      className={cn('mt-1 placeholder:text-primary-foreground bg-muted border-border', addressErrors.label ? 'border-destructive' : 'border-border')} 
                                    />
                                    {addressErrors.label && <p className="text-xs text-destructive mt-1">{addressErrors.label.message}</p>}
                                  </div>
                                  <div>
                                    <Label htmlFor="addr-street" className="text-card-foreground">Street Address</Label>
                                    <Input 
                                      id="addr-street" 
                                      {...registerAddress("street")} 
                                      placeholder="123 Main St, Apt 4B"
                                      className={cn('mt-1 placeholder:text-primary-foreground bg-muted border-border', addressErrors.street ? 'border-destructive' : 'border-border')} 
                                    />
                                    {addressErrors.street && <p className="text-xs text-destructive mt-1">{addressErrors.street.message}</p>}
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="addr-city" className="text-card-foreground">City</Label>
                                      <Input 
                                        id="addr-city" 
                                        {...registerAddress("city")} 
                                        placeholder="Your City"
                                        className={cn('mt-1 placeholder:text-primary-foreground bg-muted border-border', addressErrors.city ? 'border-destructive' : 'border-border')} 
                                      />
                                      {addressErrors.city && <p className="text-xs text-destructive mt-1">{addressErrors.city.message}</p>}
                                    </div>
                                    <div>
                                      <Label htmlFor="addr-state" className="text-card-foreground">State/Province</Label>
                                      <Input 
                                        id="addr-state" 
                                        {...registerAddress("state")} 
                                        placeholder="Your State/Province"
                                        className={cn('mt-1 placeholder:text-primary-foreground bg-muted border-border', addressErrors.state ? 'border-destructive' : 'border-border')} 
                                      />
                                      {addressErrors.state && <p className="text-xs text-destructive mt-1">{addressErrors.state.message}</p>}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="addr-zip" className="text-card-foreground">ZIP/Postal Code</Label>
                                      <Input 
                                        id="addr-zip" 
                                        {...registerAddress("zip")} 
                                        placeholder="12345 or 123456"
                                        className={cn('mt-1 placeholder:text-primary-foreground bg-muted border-border', addressErrors.zip ? 'border-destructive' : 'border-border')} 
                                      />
                                      {addressErrors.zip && <p className="text-xs text-destructive mt-1">{addressErrors.zip.message}</p>}
                                    </div>
                                    <div>
                                      <Label htmlFor="addr-country" className="text-card-foreground">Country</Label>
                                      <Input 
                                        id="addr-country" 
                                        {...registerAddress("country")} 
                                        placeholder="Your Country"
                                        className={cn('mt-1 placeholder:text-primary-foreground bg-muted border-border', addressErrors.country ? 'border-destructive' : 'border-border')} 
                                      />
                                      {addressErrors.country && <p className="text-xs text-destructive mt-1">{addressErrors.country.message}</p>}
                                    </div>
                                  </div>
                                   <div>
                                      <Label htmlFor="addr-phoneNumber" className="text-card-foreground">Contact Phone Number (Optional)</Label>
                                      <Input 
                                        id="addr-phoneNumber" 
                                        type="tel"
                                        {...registerAddress("phoneNumber")} 
                                        placeholder="e.g. +911234567890"
                                        className={cn('mt-1 placeholder:text-primary-foreground bg-muted border-border', addressErrors.phoneNumber ? 'border-destructive' : 'border-border')} 
                                      />
                                      {addressErrors.phoneNumber && <p className="text-xs text-destructive mt-1">{addressErrors.phoneNumber.message}</p>}
                                    </div>
                                  <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="outline" onClick={() => {setIsAddressFormOpen(false); setEditingAddress(null);}}>Cancel</Button></DialogClose>
                                    <Button type="submit">{editingAddress ? 'Save Changes' : 'Add Address'}</Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>
                        </div>
                        {addressesLoading ? (
                             <Skeleton className="h-20 w-full rounded-md" />
                        ) : addresses.length > 0 ? (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                {addresses.map(addr => (
                                    <div key={addr.id} className={cn("p-2.5 border rounded-md bg-input text-xs", addr.isDefault && "border-primary ring-1 ring-primary")}>
                                        <div className="flex justify-between items-start">
                                            <div className="font-medium text-foreground flex items-center">
                                                {addr.label.toLowerCase().includes('home') ? <Home className="h-3.5 w-3.5 mr-1.5 text-primary" /> : 
                                                addr.label.toLowerCase().includes('work') || addr.label.toLowerCase().includes('office') ? <Briefcase className="h-3.5 w-3.5 mr-1.5 text-primary" /> :
                                                <MapPinIconLucide className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                                }
                                                {addr.label}
                                                {addr.isDefault && <Star className="h-3 w-3 ml-1.5 fill-primary text-primary" />}
                                            </div>
                                             <div className="flex space-x-1">
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleOpenAddressForm(addr)}><Edit3 className="h-3 w-3"/></Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeleteAddress(addr.id)}><Trash2 className="h-3 w-3"/></Button>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground mt-0.5">{addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}</p>
                                        {addr.phoneNumber && <p className="text-muted-foreground mt-0.5">Phone: {addr.phoneNumber}</p>}
                                        {!addr.isDefault && (
                                            <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1 text-primary" onClick={() => setDefaultAddress(addr.id)}>Set as Default</Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground text-center py-2">No addresses saved yet.</p>
                        )}
                    </div>
                  </>
                )}

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleEditToggle} 
                  className="w-full text-foreground border-border hover:bg-muted hover:text-foreground"
                  disabled={isSaving || loadingProfileDetails || addressesLoading} 
                >
                  {isEditing ? (isSaving ? 'Saving...' : <><CheckCircle className="mr-2 h-4 w-4" />Done Editing</>) : <><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</>}
                </Button>

                <Button
                  type="button" 
                  variant="outline"
                  className="w-full text-foreground border-border hover:bg-muted hover:text-foreground"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">Account Overview</CardTitle>
              <CardDescription className="text-muted-foreground">Manage your account details and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {accountSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Link 
                      key={section.title} 
                      href={section.href} 
                      passHref
                      className="block group"
                    >
                      <div className="p-4 border rounded-lg bg-card hover:bg-primary/30 hover:border-primary/50 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
                        <div className="flex items-center mb-2">
                          <Icon className="h-6 w-6 text-primary mr-3 transition-transform group-hover:scale-110" />
                          <h3 className="text-md font-semibold text-card-foreground group-hover:text-primary">{section.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground group-hover:text-foreground/90 flex-grow">{section.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

