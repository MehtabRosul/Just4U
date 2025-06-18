
"use client";

import { useAuth } from '@/hooks/useAuth';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShoppingBag, Heart, Gift, MapPin, Bell, LogOut, LogIn, UserPlus, User } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const accountSections = [
  { title: 'My Orders', description: 'View your order history and track shipments.', icon: ShoppingBag, href: '/account/orders' },
  { title: 'My Wishlist', description: 'See your saved favorite items.', icon: Heart, href: '/wishlist' },
  { title: 'Gift Registries', description: 'Manage your gift registries for special occasions.', icon: Gift, href: '/account/registries' },
  { title: 'Address Book', description: 'Manage your shipping addresses.', icon: MapPin, href: '/account/addresses' },
  { title: 'Notifications', description: 'Manage your notification preferences.', icon: Bell, href: '/account/notifications' },
];

export default function AccountPage() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SectionTitle className="mb-8 text-center sm:text-left">My Account</SectionTitle>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-card border-border shadow-md">
              <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[200px]" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
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
                        {[...Array(4)].map((_, i) => (
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

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle className="mb-8 text-center sm:text-left">My Account</SectionTitle>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card border-border shadow-md">
            <CardHeader className="flex flex-row items-center space-x-4 pb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                <AvatarFallback>
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-6 w-6" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl text-card-foreground">
                  {user ? user.displayName || 'User' : 'Welcome, Guest'}
                </CardTitle>
                <CardDescription className="text-sm">
                  {user ? user.email : 'Sign in or register to personalize your experience.'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {user ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground hover:shadow-lg transition-all duration-200 ease-in-out hover:scale-105"
                  onClick={signOutUser}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              ) : (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full bg-primary text-primary-foreground hover:bg-red-700 hover:shadow-xl transition-all duration-200 ease-in-out hover:scale-105"
                    onClick={signInWithGoogle}
                  >
                    <LogIn className="mr-2 h-4 w-4" /> Sign in with Google
                  </Button>
                   {/* Optionally, keep a separate Sign Up if the flow differs, but Google Sign-In handles both */}
                   {/* <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-primary border-primary hover:bg-primary/10 hover:border-red-700 hover:text-red-600 hover:shadow-lg transition-all duration-200 ease-in-out hover:scale-105"
                    onClick={signInWithGoogle} // Can use the same Google Sign-In
                  >
                     <UserPlus className="mr-2 h-4 w-4" /> Sign Up with Google
                  </Button> */}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">Account Overview</CardTitle>
              <CardDescription>Manage your account details and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {accountSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Link key={section.title} href={user ? section.href : '#'} passHref
                      className={`block group ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={(e) => {
                        if (!user) {
                          e.preventDefault();
                          toast({
                            title: "Authentication Required",
                            description: "Please sign in to access this section.",
                            variant: "destructive"
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
// Placeholder toast function if not globally available or if you want it specific here
// This would typically come from your toast hook context.
const toast = (options: {title: string, description: string, variant?: 'default' | 'destructive'}) => {
    // In a real app, this would trigger a global toast notification
    if (typeof window !== 'undefined') {
      alert(`${options.title}: ${options.description}`);
    }
    console.log("Toast:", options);
};

// TODO: Create sub-pages for each account section if user is logged in:
// /account/orders, /account/registries, /account/addresses, /account/notifications
// These pages should also be protected routes.
