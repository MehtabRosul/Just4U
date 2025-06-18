
"use client";

import { SectionTitle } from '@/components/shared/SectionTitle';
import { Button } from '@/components/ui/button';
import { ShoppingBag, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  // In a real app, you'd fetch cart items from state or context,
  // potentially specific to the logged-in user.
  const cartItems: any[] = []; // Placeholder for cart items

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed to checkout.",
        variant: "destructive",
      });
      signInWithGoogle(); // Prompt to sign in
      return;
    }
    // Proceed with checkout logic for logged-in user
    console.log("Proceeding to checkout for user:", user.email);
    toast({
      title: "Checkout Initiated",
      description: "Redirecting to checkout page..."
    });
    // Example: router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Skeleton className="h-8 w-1/2 mb-6 sm:mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8 text-center">
        <SectionTitle className="mb-6 sm:mb-8">Your Shopping Cart</SectionTitle>
        <div className="py-10 sm:py-16 border border-dashed rounded-lg">
          <ShoppingBag className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
          <p className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">Sign in to view your Cart</p>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
            Log in or create an account to manage your shopping cart and proceed to checkout.
          </p>
          <Button size="lg" className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90" onClick={signInWithGoogle}>
            <LogIn className="mr-2 h-5 w-5" /> Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <SectionTitle className="mb-6 sm:mb-8 text-center sm:text-left">Your Shopping Cart</SectionTitle>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {/* Placeholder for cart items list */}
            {/* Example item structure (to be replaced with actual data mapping)
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-4">
                <Image src="https://placehold.co/80x80.png" alt="Product Image" width={80} height={80} className="rounded" />
                <div>
                  <h3 className="font-semibold text-foreground">Product Name</h3>
                  <p className="text-sm text-muted-foreground">Rs. 99.99</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="1" className="w-16 h-8 text-center" />
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            */}
            <p className="text-muted-foreground">Your cart items will appear here.</p>
          </div>

          <div className="md:col-span-1 p-6 border rounded-lg bg-card shadow-lg h-fit">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>Rs. 0.00</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <hr className="my-2 border-border" />
              <div className="flex justify-between font-bold text-lg text-foreground">
                <span>Total</span>
                <span>Rs. 0.00</span>
              </div>
            </div>
            <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 sm:py-16 border border-dashed rounded-lg">
          <ShoppingBag className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
          <p className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">Your cart is empty.</p>
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
