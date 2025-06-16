
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { WishlistButton } from '@/components/features/WishlistButton';
import { StarRating } from '@/components/shared/StarRating';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button'; // Import buttonVariants

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="block group h-full">
      <Card className="flex flex-col rounded-lg shadow-lg transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:scale-[1.02] bg-card h-full cursor-pointer">
        <CardHeader className="p-0 relative">
          <div className="block aspect-[3/4]">
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              width={300}
              height={400}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              data-ai-hint={product.dataAiHint || "gift item"}
            />
          </div>
          <div className="absolute top-2 right-2 z-10"> {/* Ensure wishlist button is on top and clickable */}
            <WishlistButton product={product} />
          </div>
          {product.trending && (
            <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded-full shadow pointer-events-none">
              Trending
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
          <CardTitle className="font-headline text-lg leading-tight mb-1 group-hover:text-accent transition-colors">
            {product.name}
          </CardTitle>
          {averageRating > 0 && (
            <div className="mb-2 flex items-center">
              <StarRating rating={averageRating} starSize="h-5 w-5" />
              <span className="ml-2 text-sm text-muted-foreground">({product.reviews?.length} review{product.reviews?.length === 1 ? "" : "s"})</span>
            </div>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 flex flex-col sm:flex-row justify-between items-center border-t border-border space-y-2 sm:space-y-0">
          <p className="text-xl font-semibold text-accent">
            Rs. {product.price.toFixed(2)}
          </p>
          <div // Changed to a div styled as a button
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'sm' }),
              "hover:bg-accent/90 transition-colors w-full sm:w-auto"
            )}
          >
            View Details
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
