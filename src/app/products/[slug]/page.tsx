
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
import { Heart, ShoppingCart, ExternalLink, ChevronRight, ChevronLeft } from 'lucide-react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const foundProduct = getProductBySlug(slug);
      setProduct(foundProduct || null);
      if (foundProduct && foundProduct.availableColors && foundProduct.availableColors.length > 0) {
        setSelectedColor(foundProduct.availableColors[0]);
      }
    }
  }, [slug]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <SectionTitle>Product Not Found</SectionTitle>
        <p>Sorry, we couldn't find the product you're looking for.</p>
        <Button asChild className="mt-4">
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
    <div className="container mx-auto px-2 sm:px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px] pr-2">
            {product.imageUrls.map((url, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "border-2 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent",
                  selectedImageIndex === index ? "border-accent" : "border-transparent hover:border-muted"
                )}
              >
                <Image
                  src={url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={80}
                  height={100}
                  className="object-cover w-20 h-24 cursor-pointer"
                  data-ai-hint={product.dataAiHint || "product detail"}
                />
              </button>
            ))}
          </div>
          <div className="relative aspect-[3/4] w-full md:flex-1">
            <Image
              src={product.imageUrls[selectedImageIndex]}
              alt={product.name}
              fill
              className="object-contain w-full h-full rounded-lg shadow-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              data-ai-hint={product.dataAiHint || "product main"}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-4">
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">{product.name}</h1>
          
          {averageRating > 0 && (
            <div className="flex items-center">
              <StarRating rating={averageRating} starSize="h-5 w-5" />
              <span className="ml-2 text-sm text-muted-foreground">({product.reviews?.length} review{product.reviews?.length === 1 ? "" : "s"})</span>
            </div>
          )}

          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-accent">Rs. {product.price.toFixed(2)}</p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-lg text-muted-foreground line-through">Rs. {product.originalPrice.toFixed(2)}</p>
            )}
            {discountPercentage > 0 && (
              <Badge variant="destructive" className="text-sm">Save {discountPercentage}%</Badge>
            )}
          </div>

          {product.soldBy && (
            <p className="text-sm text-muted-foreground">Sold By: <span className="font-medium text-foreground">{product.soldBy}</span></p>
          )}

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <WishlistButton product={product} size="lg" className="w-full sm:w-auto px-6 py-3 border border-input hover:bg-accent/10">
              <Heart className="mr-2 h-5 w-5" /> Wishlist
            </WishlistButton>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 py-3">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
           <Button 
            size="lg" 
            variant="outline"
            className="w-full sm:w-auto hover:bg-accent hover:text-accent-foreground border-accent text-accent mt-2"
            onClick={() => window.open(`https://just4ugifts.com/product/${product.id}`, '_blank')}
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Buy on Just4UGifts.com
          </Button>


          {product.availableColors && product.availableColors.length > 0 && (
            <div className="pt-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Select Color: <span className="text-foreground">{selectedColor ? product.availableColors.find(c => c === selectedColor) || selectedColor : ''}</span></h3>
              <div className="flex space-x-2">
                {product.availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring",
                      selectedColor === color ? 'ring-2 ring-offset-2 ring-accent' : 'border-muted-foreground/50'
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
        </div>
      </div>

      <Separator className="my-8" />

      {/* Product Details, Attributes, Ideal For */}
      <div className="space-y-8">
        <div>
          <h2 className="font-headline text-2xl font-semibold mb-3">Product Details</h2>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
        </div>

        {product.attributes && product.attributes.length > 0 && (
          <div>
            <h2 className="font-headline text-2xl font-semibold mb-3">Key Product Attributes</h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {product.attributes.map(attr => (
                <li key={attr.name}><span className="font-medium text-foreground">{attr.name}:</span> {attr.value}</li>
              ))}
            </ul>
          </div>
        )}

        {product.idealGiftFor && product.idealGiftFor.length > 0 && (
          <div>
            <h2 className="font-headline text-2xl font-semibold mb-3">An ideal gift for:</h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {product.idealGiftFor.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
         {/* Read More could be added here if description is very long */}
      </div>
      
      <Separator className="my-12" />

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section>
          <SectionTitle className="text-2xl sm:text-3xl mb-6">Similar Products</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
           <div className="mt-8 text-center">
            <Button asChild variant="outline" className="text-primary border-primary hover:bg-accent hover:text-accent-foreground">
              <Link href={`/products?category=${product.category}`}>View More in {product.category}</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Reviews Section - Can be expanded later */}
      {product.reviews && product.reviews.length > 0 && (
         <section className="mt-12">
            <SectionTitle className="text-2xl sm:text-3xl mb-6">Customer Reviews</SectionTitle>
            <div className="space-y-6">
            {product.reviews.map(review => (
                <div key={review.id} className="p-4 border rounded-lg bg-card">
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

    </div>
  );
}
