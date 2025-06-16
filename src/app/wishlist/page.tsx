"use client";

import { useWishlist } from '@/hooks/useWishlist';
import { ProductList } from '@/components/products/ProductList';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { HeartOff, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import { ProductDetailModal } from '@/components/products/ProductDetailModal';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <SectionTitle className="mb-0 text-left">Your Wishlist</SectionTitle>
        {wishlist.length > 0 && (
          <Button variant="outline" onClick={clearWishlist} className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
            <HeartOff className="mr-2 h-4 w-4" /> Clear Wishlist
          </Button>
        )}
      </div>

      {wishlist.length > 0 ? (
        <ProductList products={wishlist} onViewDetails={handleViewDetails} />
      ) : (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <HeartOff className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl font-semibold text-muted-foreground mb-2">Your wishlist is empty.</p>
          <p className="text-muted-foreground mb-6">Add items you love to your wishlist to save them for later.</p>
          <Button asChild size="lg">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-5 w-5" /> Start Shopping
            </Link>
          </Button>
        </div>
      )}
       {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
