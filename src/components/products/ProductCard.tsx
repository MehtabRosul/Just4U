
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { WishlistButton } from '@/components/features/WishlistButton';
import { StarRating } from '@/components/shared/StarRating';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
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
      <Card className="flex flex-col rounded-lg shadow-lg transition-shadow duration-300 ease-in-out group-hover:shadow-xl bg-card border border-border hover:border-primary/50 h-full cursor-pointer">
        <CardHeader className="p-0 relative">
          <div className="block aspect-[3/4] overflow-hidden rounded-t-lg transition-transform duration-300 group-hover:scale-105">
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              data-ai-hint={product.dataAiHint || "gift item"}
            />
          </div>
          <div className="absolute top-2 right-2 z-10">
            <WishlistButton
              product={product}
              className="bg-background/70 hover:bg-background/90 text-foreground" 
            />
          </div>
          {product.trending && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full shadow pointer-events-none">
              Trending
            </div>
          )}
           {product.originalPrice && product.price < product.originalPrice && (
            <div className="absolute bottom-2 left-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded-full shadow pointer-events-none">
              Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}
        </CardHeader>
        <CardContent className="p-3 sm:p-4 flex-grow flex flex-col">
          <CardTitle className="font-headline text-base sm:text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2 text-card-foreground">
            {product.name}
          </CardTitle>
          {averageRating > 0 && (
            <div className="mb-1 sm:mb-2 flex items-center">
              <StarRating rating={averageRating} starSize="h-4 w-4 sm:h-5 sm:w-5" iconClassName="text-yellow-400" />
              <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-muted-foreground">({product.reviews?.length} review{product.reviews?.length === 1 ? "" : "s"})</span>
            </div>
          )}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 flex-grow">{product.description}</p>
        </CardContent>
        <CardFooter className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center border-t border-border/20 space-y-2 sm:space-y-0">
          <div className="flex flex-col items-start"> {/* Ensures price text is consistently left-aligned */}
            <p className="text-lg sm:text-xl font-semibold text-primary">
              Rs. {product.price.toFixed(2)}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-xs text-muted-foreground line-through">
                Rs. {product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>
          <button
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              "border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors w-full sm:w-auto text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4"
            )}
            onClick={(e) => {
              e.preventDefault(); 
              console.log("Add to cart clicked for: ", product.name);
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </button>
        </CardFooter>
      </Card>
    </Link>
  );
}
    
