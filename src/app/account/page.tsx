
"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, Heart, Gift, MapPin, Bell, LogOut, User as UserIcon, Edit3, Camera } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const accountSections = [
  { title: 'My Orders', description: 'View your order history and track shipments.', icon: ShoppingBag, href: '/account/orders' },
  { title: 'My Wishlist', description: 'See your saved favorite items.', icon: Heart, href: '/wishlist' },
  { title: 'Gift Registries', description: 'Manage your gift registries for special occasions.', icon: Gift, href: '/account/registries' },
  { title: 'Address Book', description: 'Manage your shipping addresses.', icon: MapPin, href: '/account/addresses' },
  { title: 'Notifications', description: 'Manage your notification preferences.', icon: Bell, href: '/account/notifications' },
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

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhoneNumber(user.phoneNumber || '');
      // These are not standard Firebase Auth profile fields, so initialize them as empty or from another source if available
      setDeliveryAddress(''); 
      setAge(''); 
      setPhotoPreview(null); // Reset preview when user data changes
      setPhotoFile(null); // Reset file when user data changes
    }
  }, [user]);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save your profile.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      // Only include displayName for Firebase Auth profile update.
      // photoURL from local file selection (data URI) is too long for Firebase Auth.
      // A proper solution would involve uploading to Firebase Storage and using that URL.
      const profileDataToUpdate: { displayName?: string } = {
        displayName: displayName,
      };
      
      await updateUserFirebaseProfile(user, profileDataToUpdate);
      
      toast({ title: "Profile Updated", description: "Your display name has been updated." });

      // Reset photo states after successful save, as the new photo wasn't saved to Firebase Auth.
      // The user object update from onAuthStateChanged will reflect the displayName change.
      setPhotoFile(null);
      // Let existing user.photoURL persist in preview if no new local photo was selected
      // or if user wants to keep the Firebase Auth photo if they only changed name.
      // If a local photo *was* selected, it was just for preview and won't be saved.
      // We could clear photoPreview here: setPhotoPreview(null); 
      // This means after saving, it reverts to user.photoURL or fallback.
      // For now, let's keep the local preview if one was made, but inform the user it wasn't saved.

      // Log other non-Firebase Auth fields
      console.log("Phone number (placeholder save):", phoneNumber);
      console.log("Delivery address (placeholder save):", deliveryAddress);
      console.log("Age (placeholder save):", age);
      if (photoFile) {
        console.log("New profile photo was selected for local preview but not saved to Firebase Auth to avoid URL length errors.");
      }

    } catch (error) {
      const authError = error as Error;
      toast({ title: "Update Failed", description: authError.message || "Could not update profile.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleEditToggle = async () => {
    if (isEditing) { 
      // When "Done Editing" is clicked, save the profile.
      await handleProfileSave(); 
    }
    setIsEditing(!isEditing);
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        accept="image/*"
        className="hidden"
      />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card border-border shadow-md">
              <CardHeader className="items-center text-center pb-4">
                <div className="relative group">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={photoPreview || user?.photoURL || undefined} alt={displayName || user?.email || 'User'} />
                    <AvatarFallback>
                      {displayName ? displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : <UserIcon className="h-10 w-10" />)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      type="button"
                      size="icon" 
                      variant="outline" 
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background/80 hover:bg-background" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4 text-primary" />
                      <span className="sr-only">Change photo</span>
                    </Button>
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
                  className="w-full text-primary border-primary hover:bg-primary/10 hover:text-primary"
                  disabled={isSaving}
                >
                  <Edit3 className="mr-2 h-4 w-4" /> {isEditing ? (isSaving ? 'Saving...' : 'Done Editing') : 'Edit Profile'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
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
    

      

    

    
