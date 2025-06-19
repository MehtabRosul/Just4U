
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, UserPlus, Trash2, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart, type CartItem } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in or sign up to proceed to checkout.",
      });
      router.push('/auth');
      return;
    }
    // Proceed with checkout logic for logged-in user
    console.log("Proceeding to checkout for user:", user.email, "with items:", cartItems);
    toast({
      title: "Checkout Initiated",
      description: "Redirecting to checkout page..." // Placeholder
    });
    // Example: router.push('/checkout'); // Actual checkout page
  };

  const handleQuantityChange = (productId: string, newQuantity: string) => {
    const quantityNum = parseInt(newQuantity, 10);
    if (!isNaN(quantityNum)) {
      updateQuantity(productId, quantityNum > 0 ? quantityNum : 0); // Disallow negative, 0 will remove
    }
  };


  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Skeleton className="h-8 w-1/2 mb-6 sm:mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
          <div className="md:col-span-1 p-6 border rounded-lg bg-card shadow-lg h-fit">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <hr className="my-2 border-border" />
              <Skeleton className="h-6 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8 text-center">
        <SectionTitle className="mb-6 sm:mb-8">Your Shopping Cart</SectionTitle>
        <div className="py-10 sm:py-16 border border-dashed rounded-lg bg-card">
          <ShoppingBag className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
          <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">Access Your Cart</p>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
            Please log in or sign up to manage your shopping cart and proceed to checkout.
          </p>
          <Button asChild size="lg" className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/auth">
              <UserPlus className="mr-2 h-5 w-5" /> Login / Sign Up
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const cartSubtotal = getCartTotal();
  // Simple shipping and tax for now, can be expanded
  const shippingCost = cartSubtotal > 0 ? 50 : 0; // Example: Rs. 50 shipping, free if cart empty
  const taxRate = 0.05; // Example: 5% tax
  const taxAmount = cartSubtotal * taxRate;
  const orderTotal = cartSubtotal + shippingCost + taxAmount;


  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
        <SectionTitle className="mb-0 text-center sm:text-left">Your Shopping Cart</SectionTitle>
        {cartItems.length > 0 && (
          <Button 
            variant="outline" 
            onClick={clearCart} 
            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground w-full sm:w-auto text-sm"
          >
            <XCircle className="mr-2 h-4 w-4" /> Clear Cart
          </Button>
        )}
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item: CartItem) => (
              <Card key={item.product.id} className="bg-card border-border shadow-sm">
                <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                  <Link href={`/products/${item.product.slug}`} className="block shrink-0">
                    <Image
                      src={item.product.imageUrls[0]}
                      alt={item.product.name}
                      width={100}
                      height={120}
                      className="rounded-md object-cover w-24 h-[100px] sm:w-[100px] sm:h-[120px] border border-muted"
                      data-ai-hint={item.product.dataAiHint || "cart item"}
                    />
                  </Link>
                  <div className="flex-grow text-center sm:text-left">
                    <Link href={`/products/${item.product.slug}`} className="block">
                        <h3 className="text-sm sm:text-base font-semibold text-foreground hover:text-primary line-clamp-2">{item.product.name}</h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">Category: {item.product.category}</p>
                    <p className="text-sm sm:text-base font-medium text-primary mt-1">Rs. {item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 mt-2 sm:mt-0">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product.id, e.target.value)}
                      min="1"
                      className="w-16 h-9 text-center text-sm bg-input border-border focus:ring-primary"
                      aria-label={`Quantity for ${item.product.name}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-destructive hover:bg-destructive/10 h-9 w-9"
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-card border-border shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-card-foreground">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span className="text-foreground font-medium">Rs. {cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-foreground font-medium">Rs. {shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Tax (5%)</span>
                  <span className="text-foreground font-medium">Rs. {taxAmount.toFixed(2)}</span>
                </div>
                <Separator className="my-2 bg-border" />
                <div className="flex justify-between font-bold text-base sm:text-lg text-foreground">
                  <span>Order Total</span>
                  <span>Rs. {orderTotal.toFixed(2)}</span>
                </div>
                <Button 
                    size="lg" 
                    className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 text-base py-3" 
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 sm:py-16 border border-dashed rounded-lg bg-card">
          <ShoppingBag className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
          <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">Your cart is empty.</p>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild size="lg" className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/products">
              Start Shopping
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
