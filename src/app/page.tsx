
"use client"; 

import { useState, useEffect, useMemo } from 'react'; 
import type { Product } from '@/lib/types';
import { CATEGORIES, PRODUCTS } from '@/lib/data';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { ProductList } from '@/components/products/ProductList';
import { CategoryPill } from '@/components/products/CategoryPill';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [featuredDeals, setFeaturedDeals] = useState<Product[]>([]);
  const [personalizedProducts, setPersonalizedProducts] = useState<Product[]>([]);

  const trendingProducts = useMemo(() => PRODUCTS.filter(p => p.trending).slice(0, 4), []);
  
  useEffect(() => {
    // Client-side randomization to prevent hydration mismatch
    const deals = PRODUCTS.filter(p => !p.trending && p.price < 50) 
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    setFeaturedDeals(deals);

    const recommended = PRODUCTS.filter(p => !p.trending)
      .sort(() => 0.5 - Math.random()) 
      .slice(0, 4);
    setPersonalizedProducts(recommended);
  }, []);


  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section className="relative bg-background py-12 md:py-20 lg:py-24 overflow-hidden">
        <div className="relative z-10 text-center">
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Buy Custom Gifts & Surprise your Recipients
            </h1>
            <p className="text-md sm:text-lg text-foreground/80 mb-8 max-w-xl mx-auto">
              Most trusted personalized gifting brand for all occasions
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform hover:scale-105 rounded-full px-6 py-3 sm:px-8">
              <Link href="/products">Shop Now</Link>
            </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <SectionTitle>Shop by Category</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryPill key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Deals Section */}
      {featuredDeals.length > 0 && (
        <section>
          <SectionTitle>Featured Deals</SectionTitle>
          <ProductList products={featuredDeals} />
           <div className="mt-8 text-center">
            <Button asChild variant="outline" className="text-accent border-accent hover:bg-accent hover:text-accent-foreground">
              <Link href="/products?sort=price_asc">View More Deals</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Trending Gifts Section */}
      {trendingProducts.length > 0 && (
        <section>
          <SectionTitle>Trending Gifts</SectionTitle>
          <ProductList products={trendingProducts} />
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="text-accent border-accent hover:bg-accent hover:text-accent-foreground">
              <Link href="/products?sort=trending">View More Trending</Link>
            </Button>
          </div>
        </section>
      )}
      
      {/* Personalized Recommendations Section */}
      {personalizedProducts.length > 0 && (
         <section>
          <SectionTitle>Recommended For You</SectionTitle>
          <ProductList products={personalizedProducts} />
        </section>
      )}
    </div>
  );
}
