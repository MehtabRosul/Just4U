
"use client"; // Top-level client component for state management (modal)

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { CATEGORIES, PRODUCTS } from '@/lib/data';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { ProductList } from '@/components/products/ProductList';
import { CategoryPill } from '@/components/products/CategoryPill';
import { ProductDetailModal } from '@/components/products/ProductDetailModal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const trendingProducts = PRODUCTS.filter(p => p.trending).slice(0, 4);
  // Mock personalized recommendations: pick a few random products, not already trending
  const personalizedProducts = PRODUCTS.filter(p => !p.trending)
    .sort(() => 0.5 - Math.random()) // Shuffle
    .slice(0, 4);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section className="relative bg-background py-12 md:py-20 lg:py-24 overflow-hidden">
        <div className="relative z-10">
          <div>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Buy Custom Gifts & Surprise your Recipients
            </h1>
            <p className="text-lg sm:text-xl text-foreground/80 mb-8 max-w-xl">
              Most trusted personalized gifting brand for all occasions
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform hover:scale-105 rounded-full">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <SectionTitle>Shop by Category</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryPill key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Trending Gifts Section */}
      <section>
        <SectionTitle>Trending Gifts</SectionTitle>
        <ProductList products={trendingProducts} onViewDetails={handleViewDetails} />
        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="text-primary border-primary hover:bg-accent hover:text-accent-foreground">
            <Link href="/products?sort=trending">View More Trending</Link>
          </Button>
        </div>
      </section>

      {/* Personalized Recommendations Section */}
      <section>
        <SectionTitle>Recommended For You</SectionTitle>
        <ProductList products={personalizedProducts} onViewDetails={handleViewDetails} />
      </section>

      {/* Product Detail Modal */}
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
