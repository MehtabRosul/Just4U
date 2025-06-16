
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search as SearchIcon, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { NavMenu } from './NavMenu';
import { SiteLogo } from './SiteLogo';
import { useWishlist } from '@/hooks/useWishlist';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { wishlist } = useWishlist();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <SiteLogo />
        </div>

        {/* Desktop Navigation & Search */}
        <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
          <NavMenu />
        </div>
        
        <div className="hidden lg:flex items-center space-x-3">
            <div className="relative flex items-center">
              <Input
                type="search"
                placeholder="Search here"
                className="h-10 w-64 rounded-full pl-4 pr-12 text-sm bg-[hsl(var(--input-bg-light-pink))] focus:bg-background border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
              />
              <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 rounded-full bg-primary hover:bg-primary/90 px-3">
                <SearchIcon className="h-4 w-4 text-primary-foreground" />
                <span className="ml-1 text-xs">Search</span>
              </Button>
            </div>
            <Link href="/wishlist" passHref>
              <Button variant="ghost" size="icon" className="relative text-foreground/70 hover:text-primary">
                <Heart className="h-6 w-6" />
                {wishlist.length > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {wishlist.length}
                  </Badge>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>
            <Link href="/cart" passHref>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary">
                <ShoppingCart className="h-6 w-6" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
        </div>

        {/* Mobile Menu Trigger & Icons */}
        <div className="flex items-center space-x-2 lg:hidden">
          <Link href="/wishlist" passHref>
              <Button variant="ghost" size="icon" className="relative text-foreground/70 hover:text-primary">
                <Heart className="h-6 w-6" />
                {wishlist.length > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {wishlist.length}
                  </Badge>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>
            <Link href="/cart" passHref>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary">
                <ShoppingCart className="h-6 w-6" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0 flex flex-col bg-background">
              <div className="flex justify-between items-center p-4 border-b">
                 <SiteLogo />
                 <SheetClose asChild>
                   <Button variant="ghost" size="icon">
                     <X className="h-6 w-6" />
                     <span className="sr-only">Close menu</span>
                   </Button>
                 </SheetClose>
              </div>
              <div className="p-4 space-y-4">
                <div className="relative flex items-center">
                    <Input
                        type="search"
                        placeholder="Search here..."
                        className="h-10 w-full rounded-full pl-4 pr-12 text-sm bg-[hsl(var(--input-bg-light-pink))] focus:bg-background border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
                    />
                    <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90">
                        <SearchIcon className="h-4 w-4 text-primary-foreground" />
                        <span className="sr-only">Search</span>
                    </Button>
                </div>
              </div>
              <div className="flex-grow p-4 overflow-y-auto">
                <NavMenu isMobile onLinkClick={() => setIsMobileMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
