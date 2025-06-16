
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { WishlistButton } from '@/components/features/WishlistButton';
import { StarRating } from '@/components/shared/StarRating';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="block group h-full" passHref>
      <Card className={cn(
        "flex flex-col rounded-lg overflow-hidden shadow-md bg-card border border-border h-full cursor-pointer",
        "transition-all duration-300 ease-in-out",
        "group-hover:shadow-2xl group-hover:border-primary/60 group-hover:bg-primary/5" // Enhanced card hover
      )}>
        {/* Image Section */}
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={product.imageUrls[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300" // Image zoom
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            data-ai-hint={product.dataAiHint || "gift item"}
          />
          <div className="absolute top-2 right-2 z-10">
            <WishlistButton
              product={product}
              className="bg-background/70 hover:bg-background/90 text-foreground" 
            />
          </div>
          {product.originalPrice && product.price < product.originalPrice && (
            <div className="absolute bottom-2 left-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm z-10">
              Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}
          {product.trending && !(product.originalPrice && product.price < product.originalPrice) && (
             <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm z-10">
                Trending
              </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="font-headline text-sm sm:text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2 text-card-foreground">
            {product.name}
          </h3>

          <div className="mt-1 mb-2">
            <span className="text-base sm:text-lg font-bold text-primary">
              Rs. {product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-2 text-xs text-muted-foreground line-through">
                Rs. {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {averageRating > 0 && (
            <div className="mb-2 flex items-center">
              <StarRating rating={averageRating} starSize="h-3.5 w-3.5" iconClassName="text-yellow-400" />
              <span className="ml-1.5 text-xs text-muted-foreground">({product.reviews?.length} review{product.reviews?.length === 1 ? "" : "s"})</span>
            </div>
          )}
          
          {/* Spacer to push button to bottom */}
          <div className="flex-grow" /> 

          <Button
            variant="default"
            size="sm"
            className={cn(
              "w-full mt-2 text-xs py-2 px-3",
              "transition-all duration-200 ease-in-out", // Button transition
              "group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/40" // Button lift and shadow on card hover
            )}
            onClick={(e) => {
              e.preventDefault(); 
              console.log("Add to cart clicked for: ", product.name);
              // Actual add to cart logic would be implemented here
            }}
          >
            <ShoppingCart className="mr-1.5 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </Card>
    </Link>
  );
}
    
