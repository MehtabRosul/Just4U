
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProductBySlug, PRODUCTS } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/shared/StarRating';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart } from 'lucide-react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { SocialShareButtons } from '@/components/features/SocialShareButtons';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

export default function ProductDetailPage() {
  const { slug: slugParam } = useParams();
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { isProductInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

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
    }
  }, [slug]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleThumbnailClick = (index: number) => {
    if (index !== selectedImageIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedImageIndex(index);
        setIsTransitioning(false);
      }, 300); // match transition duration
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }
    addToCart(product);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (!user) {
        toast({
            title: "Authentication Required",
            description: "Please sign in to manage your wishlist.",
            variant: "destructive",
        });
        return;
    }
    if (isProductInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };


  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <SectionTitle className="text-foreground">Product Not Found</SectionTitle>
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
  
  const isInWishlist = isProductInWishlist(product.id);

  const ImageGallery = (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div className="relative aspect-square w-full bg-card rounded-lg overflow-hidden shadow-lg border">
        <Image
          key={product.imageUrls[selectedImageIndex]} // Using key to force re-render on change
          src={product.imageUrls[selectedImageIndex]}
          alt={product.name}
          fill
          className={cn(
            "object-contain transition-opacity duration-300 ease-in-out",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      
      {/* Thumbnails */}
      {product.imageUrls.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {product.imageUrls.map((url, index) => (
            <button
              key={`thumb-${index}`}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative w-20 h-20 shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                selectedImageIndex === index
                  ? "border-primary shadow-md"
                  : "border-transparent hover:border-muted"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={url}
                alt={`${product.name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-10 sm:mb-12">
        {ImageGallery}
        
        {/* Product Info */}
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">{product.name}</h1>
          
          <div className="flex items-center space-x-3 flex-wrap gap-y-1">
            {averageRating > 0 && (
                <StarRating rating={averageRating} starSize="h-5 w-5" />
            )}
            <span className="text-sm text-gray-400">
                {product.reviews && product.reviews.length > 0 ? `(${product.reviews.length} review${product.reviews.length === 1 ? "" : "s"})` : "(No reviews yet)"}
            </span>
            {currentUrl && product.name && (
              <SocialShareButtons url={currentUrl} title={product.name} />
            )}
          </div>
          
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-primary">Rs. {product.price.toFixed(2)}</p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-lg text-muted-foreground line-through">Rs. {product.originalPrice.toFixed(2)}</p>
            )}
            {discountPercentage > 0 && (
              <span className="text-primary text-sm">({discountPercentage}% off)</span>
            )}
          </div>

          {product.soldBy && (
            <p className="text-sm text-gray-400">Sold By: <span className="font-medium text-white">{product.soldBy}</span></p>
          )}

          {product.availableColors && product.availableColors.length > 0 && (
            <div className="pt-1 sm:pt-2">
                <h3 className="text-sm font-medium text-gray-400 mb-1.5 sm:mb-2">Select Color: <span className="text-white">{selectedColor ? product.availableColors.find(c => c === selectedColor) || selectedColor : ''}</span></h3>
              <div className="flex gap-3 flex-wrap">
                {product.availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2",
                      selectedColor === color ? 'ring-2 ring-indigo-500' : '' 
                    )}
                    style={{ backgroundColor: color.startsWith('#') ? color : undefined }}
                    title={color}
                    aria-label={`Select color ${color}`}
                  >
                   {!color.startsWith('#') && <span className="sr-only">{color}</span>}
                    <span className="block w-full h-full rounded-full" style={{ backgroundColor: color.startsWith('#') ? color : undefined }}></span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4 flex-wrap">
            <Button size="lg" onClick={handleToggleWishlist} variant="outline" className={cn("flex items-center gap-2", isInWishlist ? "bg-primary/10 border-primary text-primary" : "text-foreground")}>
                <Heart className={cn("h-5 w-5", isInWishlist && "fill-primary")} />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
            <Button size="lg" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-6 sm:my-8" />

      <div className="space-y-6 sm:space-y-8 text-foreground">
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
        <section className="text-foreground">
            <h2 className="text-2xl font-bold text-center mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </section>
      )}
    </div>
  );
}
