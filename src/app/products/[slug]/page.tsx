
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProductBySlug, PRODUCTS } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { WishlistButton } from '@/components/features/WishlistButton';
import { StarRating } from '@/components/shared/StarRating';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, ExternalLink } from 'lucide-react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { SocialShareButtons } from '@/components/features/SocialShareButtons';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  const { user } = useAuth(); // Get user
  const { toast } = useToast(); // Get toast

  useEffect(() => {
    if (slug) {
      const foundProduct = getProductBySlug(slug);
      setProduct(foundProduct || null);
      setSelectedImageIndex(0); 

      if (foundProduct && foundProduct.availableColors && foundProduct.availableColors.length > 0) {
        setSelectedColor(foundProduct.availableColors[0]);
      } else {
        setSelectedColor(null);
      }
    } else {
      setProduct(null);
      setSelectedImageIndex(0);
      setSelectedColor(null);
    }
  }, [slug]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleAddToCart = () => {
    if (!product) return;
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      // Optionally, trigger sign-in flow here
      return;
    }
    // Proceed with add to cart logic
    console.log("Add to cart clicked for: ", product.name);
    toast({ title: "Added to Cart", description: `${product.name} has been added to your cart.` });
    // Actual add to cart logic would be implemented here
  };


  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <SectionTitle className="text-foreground">Product Not Found</SectionTitle>
        <p className="text-muted-foreground">Sorry, we couldn't find the product you're looking for.</p>
        <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/products">Back to All Gifts</Link>
        </Button>
      </div>
    );
  }

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  const discountPercentage = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const similarProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12 mb-10 sm:mb-12">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-3 sm:gap-4 items-start">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[400px] lg:max-h-[500px] pr-2 pb-2 md:pb-0 w-full md:w-auto">
            {product.imageUrls.map((url, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "border-2 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary shrink-0", 
                  selectedImageIndex === index ? "border-primary" : "border-transparent hover:border-muted"
                )}
              >
                <Image
                  src={url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={80}
                  height={100}
                  className="object-cover w-16 h-20 sm:w-20 sm:h-24 cursor-pointer"
                  data-ai-hint={product.dataAiHint || "product detail"}
                />
              </button>
            ))}
          </div>
          <div className="relative aspect-[3/4] w-full md:flex-1">
            {product.imageUrls.length > 0 && selectedImageIndex < product.imageUrls.length && (
              <Image
                src={product.imageUrls[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-contain w-full h-full rounded-lg shadow-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                data-ai-hint={product.dataAiHint || "product main"}
              />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{product.name}</h1>
          
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            {averageRating > 0 && (
                <StarRating rating={averageRating} starSize="h-5 w-5" />
            )}
            <span className="text-sm text-muted-foreground">
                {product.reviews && product.reviews.length > 0 ? `(${product.reviews.length} review${product.reviews.length === 1 ? "" : "s"})` : "(No reviews yet)"}
            </span>
            {currentUrl && product.name && (
              <SocialShareButtons url={currentUrl} title={product.name} />
            )}
          </div>

          <div className="flex items-baseline space-x-2 flex-wrap">
            <p className="text-2xl sm:text-3xl font-bold text-primary">Rs. {product.price.toFixed(2)}</p> 
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-md sm:text-lg text-muted-foreground line-through">Rs. {product.originalPrice.toFixed(2)}</p>
            )}
            {discountPercentage > 0 && (
              <Badge variant="destructive" className="text-sm">Save {discountPercentage}%</Badge>
            )}
          </div>

          {product.soldBy && (
            <p className="text-sm text-muted-foreground">Sold By: <span className="font-medium text-foreground">{product.soldBy}</span></p>
          )}

          {product.availableColors && product.availableColors.length > 0 && (
            <div className="pt-1 sm:pt-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-1.5 sm:mb-2">Select Color: <span className="text-foreground">{selectedColor ? product.availableColors.find(c => c === selectedColor) || selectedColor : ''}</span></h3>
              <div className="flex space-x-2 flex-wrap gap-y-2">
                {product.availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring",
                      selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : 'border-muted-foreground/50' 
                    )}
                    style={{ backgroundColor: color.startsWith('#') ? color : undefined }}
                    title={color}
                    aria-label={`Select color ${color}`}
                  >
                   {!color.startsWith('#') && <span className="sr-only">{color}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-2 sm:space-y-3 pt-3 sm:pt-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <WishlistButton 
                product={product} 
                className="w-full sm:w-auto px-6 py-3 border border-input hover:bg-accent/20 text-primary flex items-center justify-center text-base" // Ensure consistent styling like Button
                size="lg" // Prop from WishlistButton might not directly map to Button's size, style manually
              > 
                 <Heart className="mr-2 h-5 w-5" /> Wishlist
              </WishlistButton>
              <Button size="lg" variant="default" className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddToCart}> 
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
            </div>
             <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto hover:bg-primary hover:text-primary-foreground border-primary text-primary"
              onClick={() => window.open(`https://just4ugifts.com/product/${product.id}`, '_blank')}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Buy on Just4UGifts.com
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-6 sm:my-8" />

      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="font-headline text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">Product Details</h2>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{product.description}</p>
        </div>

        {product.attributes && product.attributes.length > 0 && (
          <div>
            <h2 className="font-headline text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">Key Product Attributes</h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm sm:text-base">
              {product.attributes.map(attr => (
                <li key={attr.name}><span className="font-medium text-foreground">{attr.name}:</span> {attr.value}</li>
              ))}
            </ul>
          </div>
        )}

        {product.idealGiftFor && product.idealGiftFor.length > 0 && (
          <div>
            <h2 className="font-headline text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">An ideal gift for:</h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm sm:text-base">
              {product.idealGiftFor.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <Separator className="my-8 sm:my-12" />

      {product.reviews && product.reviews.length > 0 && (
         <section className="mb-10 sm:mb-12">
            <SectionTitle className="text-xl sm:text-2xl mb-4 sm:mb-6 text-foreground">Customer Reviews</SectionTitle>
            <div className="space-y-4 sm:space-y-6">
            {product.reviews.map(review => (
                <div key={review.id} className="p-3 sm:p-4 border rounded-lg bg-card shadow">
                <div className="flex items-center mb-1">
                    <StarRating rating={review.rating} starSize="h-4 w-4" />
                    <span className="ml-2 text-sm font-medium text-foreground">{review.author}</span>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
                <p className="text-xs text-muted-foreground/80 mt-1">{new Date(review.date).toLocaleDateString()}</p>
                </div>
            ))}
            </div>
        </section>
      )}

      {similarProducts.length > 0 && (
        <section>
          <SectionTitle className="text-xl sm:text-2xl mb-4 sm:mb-6 text-foreground">Similar Products</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
           <div className="mt-6 sm:mt-8 text-center">
            <Button asChild variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground px-5 py-2.5 sm:px-6">
              <Link href={`/products?category=${product.category}`}>View More in {product.category}</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
