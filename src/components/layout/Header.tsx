"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, Search as SearchIcon, Heart, User as UserIcon, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { SiteLogo } from './SiteLogo';
import { useWishlist } from '@/hooks/useWishlist';
import { Badge } from '@/components/ui/badge';
import { NavMenu } from './NavMenu'; 
import { GLOBAL_NAV_LINKS } from '@/config/site'; 
import { useAuth } from '@/hooks/useAuth'; 
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { wishlist, loading: wishlistLoading } = useWishlist(); // Added loading state
  const { user, loading: authLoading } = useAuth(); 
  const { getTotalItems: getTotalCartItems, loading: cartLoading } = useCart(); // Added loading state

  const totalCartItems = getTotalCartItems();
  const totalWishlistItems = wishlist.length; // wishlist itself is now the array of Product objects

  // Handler for search submit
  const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false); // close mobile menu if open
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-[var(--primary-header-bg)] bg-opacity-75 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Mobile Menu Trigger - shown first for mobile layout flow */}
        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="bg-card text-primary border-primary hover:bg-primary hover:text-card rounded-full p-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 flex flex-col bg-background text-foreground">
              <SheetHeader className="flex flex-row justify-between items-center p-4 border-b">
                 <SiteLogo hideTagline />
                 <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="p-4 space-y-4">
                {/* Mobile Search Bar */}
                <form onSubmit={handleSearch} className="relative flex items-center">
                  <Input
                    type="search"
                    placeholder="Search for Gifts..."
                    className="h-10 w-full rounded-md pl-4 pr-10 text-sm bg-input text-foreground placeholder:text-input-placeholder border-border focus:ring-primary"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary">
                    <SearchIcon className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                  </Button>
                </form>
              </div>
              <div className="flex-grow p-4 overflow-y-auto">
                <NavMenu isMobile onLinkClick={() => setIsMobileMenuOpen(false)} navLinks={GLOBAL_NAV_LINKS} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo - Centered on mobile if no menu trigger, left on desktop */}
        <div className="flex items-center lg:flex-none">
          <SiteLogo />
        </div>

        {/* Desktop Search Bar - Centered */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-8">
          <form onSubmit={handleSearch} className="relative flex items-center w-full max-w-xl">
            <Input
              type="search"
              placeholder="Search for Gifts..."
              className="h-10 w-full rounded-md pl-4 pr-12 text-sm bg-input text-foreground placeholder:text-input-placeholder border-border focus:ring-primary"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 rounded-md bg-primary hover:bg-primary/90 px-3">
              <SearchIcon className="h-4 w-4 text-primary-foreground" />
            </Button>
          </form>
        </div>
        
        {/* Desktop & Mobile Quick Access Icons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
            <Link href="/wishlist" passHref>
              <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary hover:bg-accent/10 rounded-full">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                {!authLoading && !wishlistLoading && totalWishlistItems > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-xs">
                    {totalWishlistItems}
                  </Badge>
                )}
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>
            
            <Link href="/account" passHref>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-accent/10 rounded-full">
                <UserIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>

            <Link href="/cart" passHref>
              <Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary hover:bg-accent/10 rounded-full">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                 {!authLoading && !cartLoading && totalCartItems > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-xs">
                    {totalCartItems}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
        </div>
      </div>
    </header>
  );
}
