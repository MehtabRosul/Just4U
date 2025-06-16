"use client";

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/useWishlist';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  product: Product;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

export function WishlistButton({ product, className, size = 'icon', showText = false }: WishlistButtonProps) {
  const { wishlist, addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlist();
  const isInWishlist = isProductInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if on a card link
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggleWishlist}
      className={cn(
        "group rounded-full p-2 transition-all duration-200 ease-in-out",
        isInWishlist 
          ? "text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20" 
          : "text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20",
        className
      )}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={cn("h-5 w-5 transition-all group-hover:scale-110", isInWishlist ? "fill-destructive text-destructive" : "text-inherit")} />
      {showText && <span className="ml-2">{isInWishlist ? 'In Wishlist' : 'Remove from Wishlist'}</span>}
    </Button>
  );
}
