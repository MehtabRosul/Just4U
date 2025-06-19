
"use client";

import { useWishlist } from '@/hooks/useWishlist';
import { ProductList } from '@/components/products/ProductList';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { HeartOff, ShoppingBag, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

export default function WishlistPage() {
  const { wishlist, clearWishlist, loading: wishlistLoading } = useWishlist();
  const { user, loading: authLoading } = useAuth();

  const isLoading = authLoading || wishlistLoading;

  if (isLoading && !user) { // Show skeleton only if initial auth check is happening
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[350px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!user && !authLoading) { // User explicitly not logged in
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8 text-center">
        <SectionTitle className="mb-6 sm:mb-8">Your Wishlist</SectionTitle>
        <div className="py-10 sm:py-16 border border-dashed rounded-lg bg-card">
          <HeartOff className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
          <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">Access Your Wishlist</p>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
            Please log in or sign up to view and manage your saved items.
          </p>
          <Button asChild size="lg" className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/auth">
              <UserPlus className="mr-2 h-5 w-5" /> Login / Sign Up
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // User is logged in, show wishlist or loading state for wishlist items
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
        <SectionTitle className="mb-0 text-center sm:text-left">Your Wishlist</SectionTitle>
        {wishlist.length > 0 && !wishlistLoading && (
          <Button variant="outline" onClick={clearWishlist} className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground w-full sm:w-auto text-sm sm:text-base px-4 py-2">
            <HeartOff className="mr-2 h-4 w-4" /> Clear Wishlist
          </Button>
        )}
      </div>

      {wishlistLoading && user ? ( // Show skeleton for product list while wishlist items are loading for a logged-in user
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[350px] rounded-lg" />
            ))}
          </div>
        ) : wishlist.length > 0 ? (
          <ProductList products={wishlist} />
        ) : (
        <div className="text-center py-10 sm:py-16 border border-dashed rounded-lg mt-4 sm:mt-0 bg-card">
          <HeartOff className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
          <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">Your wishlist is empty.</p>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">Add items you love to your wishlist to save them for later.</p>
          <Button asChild size="lg" className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-5 w-5" /> Start Shopping
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
