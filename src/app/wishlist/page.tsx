
"use client";

import { useWishlist } from '@/hooks/useWishlist';
import { ProductList } from '@/components/products/ProductList';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { HeartOff, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
        <SectionTitle className="mb-0 text-center sm:text-left">Your Wishlist</SectionTitle>
        {wishlist.length > 0 && (
          <Button variant="outline" onClick={clearWishlist} className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground w-full sm:w-auto text-sm sm:text-base px-4 py-2">
            <HeartOff className="mr-2 h-4 w-4" /> Clear Wishlist
          </Button>
        )}
      </div>

      {wishlist.length > 0 ? (
        <ProductList products={wishlist} />
      ) : (
        <div className="text-center py-10 sm:py-16 border border-dashed rounded-lg mt-4 sm:mt-0">
          <HeartOff className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
          <p className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">Your wishlist is empty.</p>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">Add items you love to your wishlist to save them for later.</p>
          <Button asChild size="lg" className="px-6 py-3">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-5 w-5" /> Start Shopping
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
