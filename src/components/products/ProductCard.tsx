"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { WishlistButton } from '@/components/features/WishlistButton';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] bg-card">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.slug}`} className="block aspect-[3/4] overflow-hidden" onClick={(e) => { if(onViewDetails) { e.preventDefault(); onViewDetails(product); }}}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={300}
            height={400}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            data-ai-hint={product.dataAiHint || "gift item"}
          />
        </Link>
        <div className="absolute top-2 right-2">
          <WishlistButton product={product} />
        </div>
        {product.trending && (
           <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded-full shadow">
            Trending
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.slug}`} className="block" onClick={(e) => { if(onViewDetails) { e.preventDefault(); onViewDetails(product); }}}>
          <CardTitle className="font-headline text-lg leading-tight mb-1 hover:text-accent transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t border-border">
        <p className="text-xl font-semibold text-accent">
          ${product.price.toFixed(2)}
        </p>
        <Button 
          size="sm" 
          onClick={() => onViewDetails && onViewDetails(product)} 
          variant="outline" 
          className="hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
