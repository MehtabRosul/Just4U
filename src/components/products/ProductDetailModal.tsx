"use client";

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Product, Review } from '@/lib/types';
import { WishlistButton } from '@/components/features/WishlistButton';
import { SocialShareButtons } from '@/components/features/SocialShareButtons';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Gift, MessageSquare, Star } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

function ProductReviews({ reviews }: { reviews?: Review[] }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet.</p>;
  }
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-md">Customer Reviews</h4>
      {reviews.map(review => (
        <div key={review.id} className="border-b pb-2">
          <div className="flex items-center mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="ml-2 text-sm font-medium">{review.author}</span>
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
              <DialogTitle className="font-headline text-3xl">{product.name}</DialogTitle>
              <DialogDescription className="text-base">{product.description}</DialogDescription>
            </DialogHeader>

            <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Category:</span>
              <Badge variant="secondary">{product.category}</Badge>
            </div>

            {product.giftWrapAvailable && (
              <div className="flex items-center text-sm text-green-600">
                <Gift className="h-4 w-4 mr-2" />
                Gift wrapping available
              </div>
            )}
            {product.personalizedMessageAvailable && (
              <div className="flex items-center text-sm text-green-600">
                <MessageSquare className="h-4 w-4 mr-2" />
                Personalized message option
              </div>
            )}
            
            <Separator />
            <ProductReviews reviews={product.reviews} />
            
          </div>
        </div>
        </ScrollArea>
        <DialogFooter className="p-6 border-t bg-muted/30 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex items-center space-x-2">
            <WishlistButton product={product} size="default" showText />
            <SocialShareButtons url={productUrl} title={product.name} />
          </div>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
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

