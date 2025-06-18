
"use client";

import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, ShoppingBag, Heart, Gift, MapPin, Bell, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

const accountSections = [
  { title: 'My Orders', description: 'View your order history and track shipments.', icon: ShoppingBag, href: '/account/orders' },
  { title: 'My Wishlist', description: 'See your saved favorite items.', icon: Heart, href: '/wishlist' },
  { title: 'Gift Registries', description: 'Manage your gift registries for special occasions.', icon: Gift, href: '/account/registries' },
  { title: 'Address Book', description: 'Manage your shipping addresses.', icon: MapPin, href: '/account/addresses' },
  { title: 'Notifications', description: 'Manage your notification preferences.', icon: Bell, href: '/account/notifications' },
];


export default function AccountPage() {
  const handleLogin = () => {
    console.log('Login button clicked');
    alert('Login functionality to be implemented.');
  };

  const handleSignUp = () => {
    console.log('Sign Up button clicked');
    alert('Sign Up functionality to be implemented.');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle className="mb-8 text-center sm:text-left">My Account</SectionTitle>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: User Info & Quick Actions */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card border-border shadow-md">
            <CardHeader className="flex flex-row items-center space-x-4 pb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl text-card-foreground">Welcome, Guest</CardTitle>
                <CardDescription className="text-sm">Sign in or register to personalize your experience.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="default" 
                size="sm" 
                className="w-full bg-primary text-primary-foreground hover:bg-red-700 hover:shadow-xl transition-all duration-200 ease-in-out hover:scale-105"
                onClick={handleLogin}
              >
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-primary border-primary hover:bg-primary/10 hover:border-red-700 hover:text-red-600 hover:shadow-lg transition-all duration-200 ease-in-out hover:scale-105"
                onClick={handleSignUp}
              >
                 <UserPlus className="mr-2 h-4 w-4" /> Sign Up
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Account Sections */}
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
                                <Link key={section.title} href={section.href} className="block group">
                                    <div className="p-4 border rounded-lg bg-card hover:bg-primary/20 hover:border-primary/50 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
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

// TODO: Create sub-pages for each account section:
// /account/orders, /account/registries, /account/addresses, /account/notifications
