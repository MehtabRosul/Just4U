
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { WishlistButton } from '@/components/features/WishlistButton';
import { StarRating } from '@/components/shared/StarRating';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button'; 

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="block group h-full" passHref>
      <Card className="flex flex-col rounded-lg shadow-lg transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:scale-[1.02] bg-card h-full cursor-pointer border border-border hover:border-primary/50">
        <CardHeader className="p-0 relative">
          <div className="block aspect-[3/4] transition-transform duration-300 group-hover:scale-105 overflow-hidden rounded-t-lg">
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
              className="bg-background/70 hover:bg-background/90" // Adjusted for light theme
            />
          </div>
          {product.trending && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full shadow pointer-events-none">
              Trending
            </div>
          )}
        </CardHeader>
        <CardContent className="p-3 sm:p-4 flex-grow flex flex-col">
          <CardTitle className="font-headline text-base sm:text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2 text-foreground">
            {product.name}
          </CardTitle>
          {averageRating > 0 && (
            <div className="mb-1 sm:mb-2 flex items-center">
              <StarRating rating={averageRating} starSize="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-muted-foreground">({product.reviews?.length} review{product.reviews?.length === 1 ? "" : "s"})</span>
            </div>
          )}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 flex-grow">{product.description}</p>
        </CardContent>
        <CardFooter className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center border-t border-border space-y-2 sm:space-y-0">
          <p className="text-lg sm:text-xl font-semibold text-primary">
            Rs. {product.price.toFixed(2)}
          </p>
          <div 
            className={cn(
              buttonVariants({ variant: 'default', size: 'sm' }), // Changed to default (red)
              "hover:bg-primary/90 transition-colors w-full sm:w-auto text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4"
            )}
          >
            View Details
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
