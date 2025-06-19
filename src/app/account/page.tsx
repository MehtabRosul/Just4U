
"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, Heart, Gift, MapPin, Bell, LogOut, User as UserIcon, Edit3, Camera, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';

const accountSections = [
  { title: 'My Orders', description: 'View your order history and track shipments.', icon: ShoppingBag, href: '/account/orders' },
  { title: 'My Wishlist', description: 'See your saved favorite items.', icon: Heart, href: '/wishlist' },
  { title: 'Gift Registries', description: 'Manage your gift registries for special occasions.', icon: Gift, href: '/account/registries' },
  { title: 'Address Book', description: 'Manage your shipping addresses.', icon: MapPin, href: '/account/addresses' },
  { title: 'Notifications', description: 'Manage your notification preferences.', icon: Bell, href: '/account/notifications' },
];

const LOCAL_STORAGE_PROFILE_KEY_PREFIX = 'just4u_profile_';

interface StoredProfileData {
  phoneNumber?: string;
  deliveryAddress?: string;
  age?: string;
}

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


export default function AccountPage() {
  const { user, loading, signOutUser, updateUserFirebaseProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [age, setAge] = useState('');
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);


  useEffect(() => {
    if (user && !loading) {
      setDisplayName(user.displayName || '');
      // Only set photoPreview from user.photoURL if not already set by local selection
      // This helps retain a locally chosen avatar preview even if displayName update triggers re-render
      if (!isEditing) { 
        setPhotoPreview(user.photoURL || null);
      }

      const storageKey = `${LOCAL_STORAGE_PROFILE_KEY_PREFIX}${user.uid}`;
      try {
        const storedDataString = localStorage.getItem(storageKey);
        if (storedDataString) {
          const storedData: StoredProfileData = JSON.parse(storedDataString);
          setPhoneNumber(storedData.phoneNumber || '');
          setDeliveryAddress(storedData.deliveryAddress || '');
          setAge(storedData.age || '');
        } else {
          setPhoneNumber('');
          setDeliveryAddress('');
          setAge('');
        }
      } catch (error) {
        console.error("Error loading profile data from localStorage:", error);
        setPhoneNumber('');
        setDeliveryAddress('');
        setAge('');
      }
    } else if (!user && !loading) {
      // User logged out, clear all fields
      setDisplayName('');
      setPhoneNumber('');
      setDeliveryAddress('');
      setAge('');
      setPhotoPreview(null);
      setIsEditing(false); 
    }
  }, [user, loading, isEditing]);


  const handleProfileSave = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save your profile.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const profileDataToUpdate: { displayName?: string; photoURL?: string } = {
        displayName: displayName,
      };

      if (photoPreview && photoPreview !== user.photoURL) {
        profileDataToUpdate.photoURL = photoPreview;
      } else if (photoPreview === null && user.photoURL !== null) { // Case for removing avatar
        profileDataToUpdate.photoURL = ""; // Set to empty string to remove in Firebase
      }


      await updateUserFirebaseProfile(user, profileDataToUpdate);
      
      toast({ title: "Profile Updated", description: "Your profile details have been updated." });

      const otherProfileData: StoredProfileData = { phoneNumber, deliveryAddress, age };
      const storageKey = `${LOCAL_STORAGE_PROFILE_KEY_PREFIX}${user.uid}`;
      localStorage.setItem(storageKey, JSON.stringify(otherProfileData));
      
    } catch (error) {
      const authError = error as Error;
      toast({ title: "Update Failed", description: authError.message || "Could not update profile.", variant: "destructive" });
    } finally {
      setIsSaving(false);
      setIsEditing(false); 
    }
  };
  
  const handleEditToggle = async () => {
    if (isEditing) { 
      await handleProfileSave(); 
    } else {
      if (user) {
        setDisplayName(user.displayName || '');
        setPhotoPreview(user.photoURL || null); 
        const storageKey = `${LOCAL_STORAGE_PROFILE_KEY_PREFIX}${user.uid}`;
        const storedDataString = localStorage.getItem(storageKey);
        if (storedDataString) {
          const storedData: StoredProfileData = JSON.parse(storedDataString);
          setPhoneNumber(storedData.phoneNumber || '');
          setDeliveryAddress(storedData.deliveryAddress || '');
          setAge(storedData.age || '');
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

  if (loading) {
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
                <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[...Array(accountSections.length)].map((_, i) => (
                            <Skeleton key={i} className="h-[100px] rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user && !loading) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle className="mb-8 text-center sm:text-left">My Account</SectionTitle>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card border-border shadow-md">
              <CardHeader className="items-center text-center pb-4">
                <div className="relative group">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={photoPreview || undefined} alt={displayName || user?.email || 'User'} />
                    <AvatarFallback>
                      {displayName ? displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : <UserIcon className="h-10 w-10" />)}
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
                    {displayName || user?.email || 'User Profile'}
                  </CardTitle>
                )}
                 <CardDescription className="text-sm text-center text-muted-foreground">
                  {user?.email}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                {isEditing && (
                  <>
                    <div>
                      <Label htmlFor="phoneNumber" className="text-xs text-muted-foreground">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                        placeholder="Your phone number"
                        className="mt-1 bg-input border-border focus:ring-primary text-foreground"
                      />
                    </div>
                     <div>
                      <Label htmlFor="age" className="text-xs text-muted-foreground">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
                        placeholder="Your age"
                        className="mt-1 bg-input border-border focus:ring-primary text-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryAddress" className="text-xs text-muted-foreground">Delivery Address</Label>
                      <Input
                        id="deliveryAddress"
                        value={deliveryAddress}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDeliveryAddress(e.target.value)}
                        placeholder="Your delivery address"
                        className="mt-1 bg-input border-border focus:ring-primary text-foreground"
                      />
                    </div>
                  </>
                )}

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleEditToggle} 
                  className="w-full text-foreground border-border hover:bg-muted hover:text-foreground"
                  disabled={isSaving}
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
                    <Link key={section.title} href={user ? section.href : '#'} passHref
                      className={cn(
                        "block group",
                        !user ? 'opacity-50 cursor-not-allowed' : ''
                      )}
                      onClick={(e) => {
                        if (!user) {
                          e.preventDefault();
                          toast({
                            title: "Authentication Required",
                            description: "Please log in or sign up to access this section.",
                            variant: "default"
                          });
                        }
                      }}
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
    

    