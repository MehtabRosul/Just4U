
"use client";

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Product, Review } from '@/lib/types';
import { WishlistButton } from '@/components/features/WishlistButton';
import { SocialShareButtons } from '@/components/features/SocialShareButtons';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Gift, MessageSquare, Star, ShoppingCart } from 'lucide-react'; // Added ShoppingCart
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { StarRating } from '@/components/shared/StarRating';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

function ProductOverallRating({ reviews }: { reviews?: Review[] }) {
  if (!reviews || reviews.length === 0) {
    return null;
  }
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  return (
    <div className="flex items-center space-x-2">
      <StarRating rating={averageRating} starSize="h-5 w-5" />
      <span className="text-sm text-muted-foreground">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
    </div>
  );
}

function ProductReviewsDisplay({ reviews }: { reviews?: Review[] }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet.</p>;
  }
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-md text-foreground">Customer Reviews</h4>
      {reviews.map(review => (
        <div key={review.id} className="border-b border-border pb-3 mb-3">
          <div className="flex items-center mb-1">
            <StarRating rating={review.rating} starSize="h-4 w-4" />
            <span className="ml-2 text-sm font-medium text-foreground">{review.author}</span>
          </div>
          <p className="text-sm text-muted-foreground">{review.comment}</p>
          <p className="text-xs text-muted-foreground/80 mt-1">{new Date(review.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/products/${product.slug}` : `/products/${product.slug}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
        <ScrollArea className="flex-grow">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image Section */}
          <div className="aspect-square md:aspect-auto">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="object-contain w-full h-full rounded-lg shadow-md"
              data-ai-hint={product.dataAiHint || "gift item"}
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col space-y-4">
            <DialogHeader>
              <DialogTitle className="font-headline text-3xl text-foreground">{product.name}</DialogTitle>
              {product.reviews && product.reviews.length > 0 && (
                <ProductOverallRating reviews={product.reviews} />
              )}
              <DialogDescription className="text-base text-muted-foreground pt-2">{product.description}</DialogDescription>
            </DialogHeader>

            <p className="text-3xl font-bold text-accent">${product.price.toFixed(2)}</p>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Category:</span>
              <Badge variant="secondary">{product.category}</Badge>
            </div>

            {product.giftWrapAvailable && (
              <div className="flex items-center text-sm text-green-500">
                <Gift className="h-4 w-4 mr-2" />
                Gift wrapping available
              </div>
            )}
            {product.personalizedMessageAvailable && (
              <div className="flex items-center text-sm text-green-500">
                <MessageSquare className="h-4 w-4 mr-2" />
                Personalized message option
              </div>
            )}
            
            <Separator className="my-4" />
            <ProductReviewsDisplay reviews={product.reviews} />
            
          </div>
        </div>
        </ScrollArea>
        <DialogFooter className="p-6 border-t border-border bg-muted/30 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex items-center space-x-2">
            <WishlistButton product={product} size="default" showText />
            <SocialShareButtons url={productUrl} title={product.name} />
          </div>
          <Button 
            size="lg" 
            variant="secondary" // Changed to secondary for red background
            className="hover:bg-accent/90 text-accent-foreground w-full sm:w-auto shadow-md"
            onClick={() => window.open(`https://just4ugifts.com/product/${product.id}`, '_blank')}
            aria-label={`Purchase ${product.name} on Just4UGifts.com`}
            >
            <ExternalLink className="mr-2 h-5 w-5" />
            Buy on Just4UGifts.com
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
