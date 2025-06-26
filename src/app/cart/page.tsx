
"use client";

import Image from 'next/image';
import { useState, ChangeEvent } from 'react';
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
import { useAddresses } from '@/hooks/useAddresses';

export default function CartPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null); // State for the selected file
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { user, loading: authLoading } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, loading: cartLoading } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const { addresses, loading: addressesLoading } = useAddresses(); // Fetch user addresses
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null); // State for selected address ID

  const isLoading = authLoading || cartLoading;

  const handleQuantityChange = (productId: string, newQuantity: string) => {
    const quantityNum = parseInt(newQuantity, 10);
    if (!isNaN(quantityNum)) {
      updateQuantity(productId, quantityNum > 0 ? quantityNum : 0); // Disallow negative, 0 will remove
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    document.getElementById('manual-photo-upload')?.click();
  };


  if (isLoading && !user) { // Skeleton for initial load before user status is known
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

  if (!user && !authLoading) { // User is definitely not logged in
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
  const shippingCost = cartSubtotal > 0 ? 50 : 0;
  const taxRate = 0.05;
  const taxAmount = cartSubtotal * taxRate;
  const orderTotal = cartSubtotal + shippingCost + taxAmount;


 return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
 <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
 <SectionTitle className="mb-0 text-center sm:text-left">Your Shopping Cart</SectionTitle>
 {cartItems.length > 0 && !cartLoading && (
 <Button
            variant="outline" 
            onClick={clearCart} 
            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground w-full sm:w-auto text-sm"
          >
            <XCircle className="mr-2 h-4 w-4" /> Clear Cart
          </Button>
        )}
      </div>

 {/* Manual Photo Upload Section */}

      {cartLoading && user ? ( // Skeleton for cart items if user is logged in but cart is loading
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg" />
            </div>
             <div className="lg:col-span-1 p-6 border rounded-lg bg-card shadow-lg h-fit">
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
      ) : cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full"> {/* Added w-full here */}
 <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item: CartItem) => (
 <Card
 key={item.product.id}
 className="bg-secondary text-secondary-foreground border-border shadow-sm hover:bg-muted transition-colors"
              >
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
                        <h3 className="text-sm sm:text-base font-semibold text-secondary-foreground hover:text-primary line-clamp-2">{item.product.name}</h3>
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
                      className="w-16 h-9 text-center text-sm bg-input border-border focus:ring-primary text-foreground"
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
 
            {/* Manual Photo Upload Section */}
            <div className="my-8 p-6 border rounded-lg bg-card shadow-sm">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Upload a Photo for Your Order</h2>
              <div
                className="border border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={triggerFileUpload}
              >
                <input
                  id="manual-photo-upload"
                  type="file"
                  accept="image/*" // Accept any image format
                  className="hidden" // Hide the default file input
                  onChange={handlePhotoUpload} // Add the change handler here
                />
                {!selectedPhoto && (<p className="text-muted-foreground">Click to select a photo</p>)}
                {previewUrl && (<img src={previewUrl} alt="Photo preview" className="mt-4 max-w-[250px] max-h-[250px] object-contain mx-auto rounded-md" />)}
              </div>
            </div>
          </div>

 <div className="lg:col-span-1">
            <Card className="bg-card border-border shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-card-foreground">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {cartItems.map((item: CartItem) => (
                  <div key={item.product.id} className="flex justify-between items-center text-black"> 
 <span className="flex-grow pr-2 truncate">{item.product.name} ({item.quantity})</span>
                    <span className="font-medium shrink-0 text-black">Rs. {(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                {/* Display "Item(s) Total" correctly even if cartItems.length is 0 but subtotal is calculated */}
                {cartItems.length > 0 && <Separator className="my-2 bg-border" />}

                 <div className="flex justify-between text-foreground">
 <span className="text-black">Item(s) Total</span>
                  <span className="font-medium text-black">Rs. {cartSubtotal.toFixed(2)}</span>
 </div>

                <div className="flex justify-between text-foreground">
                  <span className="text-black">Shipping</span>
                  <span className="font-medium text-black">Rs. {shippingCost.toFixed(2)}</span>
                </div>
                {/* Display Estimated Tax only if taxAmount is greater than 0 */}

                {taxAmount > 0 && (<>
 <div className="flex justify-between text-black">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-medium text-black"> {/* Removed redundant span */}
                    {taxAmount > 0 ? `Rs. ${taxAmount.toFixed(2)}` : 'Rs. 0.00'}
                  </span>
 </div>
                </>)}

                <Separator className="my-2 bg-border" />

                {/* Address Selection Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-card-foreground">Delivery Address</h3>
                  {addressesLoading ? (
                    <Skeleton className="h-24 w-full" />
                  ) : addresses && addresses.length > 0 ? (
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {addresses.map(address => (
                        <div
                          key={address.id}
                          className={`p-3 border rounded-md cursor-pointer ${selectedAddress === address.id ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'}`}
                          onClick={() => setSelectedAddress(address.id)}
                        >
                          <p className="text-sm font-medium">{address.street}</p>
                          <p className="text-xs text-muted-foreground">{`${address.city}, ${address.state} ${address.zip}`}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md bg-muted text-muted-foreground">
                      <p className="text-sm mb-2">No saved addresses. Please add one to proceed.</p>
                      <Button size="sm" variant="outline" /* Add onClick to open add address form/modal */>
                        Add New Address
                      </Button>
                    </div>
                  )}
                </div>

                          <div className="flex justify-between font-bold text-base sm:text-lg text-black">
                          <span>Order Total</span>
                          <span className="text-black">Rs. {orderTotal.toFixed(2)}</span>
                          </div>
                          <Button
                          onClick={() => {
                              if (cartItems.length > 0 && selectedAddress) {
                                             const orderDetailsToStore = {
 cartItems: cartItems.map(item => ({...item, product: {...item.product}})), // Ensure product is plain object
                                                  selectedAddress: addresses.find(addr => addr.id === selectedAddress),
                                                  photoPreviewUrl: previewUrl,
                                                  subtotal: cartSubtotal,
                                                  shipping: shippingCost,
                                                  tax: taxAmount,
 total: orderTotal,
 };
 localStorage.setItem('orderDetails', JSON.stringify(orderDetailsToStore)); // Temporarily store data in localStorage
                  router.push('/checkout');
                  }
                          }}
                                  className="w-full"
                disabled={cartItems.length === 0 || !selectedAddress}
                >
                                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : ( // Cart is empty (and not loading for a logged-in user)
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

  )
}
