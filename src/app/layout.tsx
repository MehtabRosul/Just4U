
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/hooks/useAuth';
import { WishlistProvider } from '@/hooks/useWishlist';
import { CartProvider } from '@/hooks/useCart';
import { AddressesProvider } from '@/hooks/useAddresses'; // Import AddressesProvider
import { OrdersProvider } from '@/hooks/useOrders'; // Import OrdersProvider
import { GiftRegistriesProvider } from '@/hooks/useGiftRegistries'; // Import GiftRegistriesProvider


export const metadata: Metadata = {
  title: 'Just4U - Gift with Personal Touch',
  description: 'Browse our collection of unique and personalized gifts for every occasion and recipient.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <AuthProvider>
          <AddressesProvider> {/* AddressesProvider depends on AuthProvider */}
            <WishlistProvider> {/* WishlistProvider depends on AuthProvider */}
              <CartProvider> {/* CartProvider depends on AuthProvider */}
                <OrdersProvider> {/* OrdersProvider depends on AuthProvider */}
                  <GiftRegistriesProvider> {/* GiftRegistriesProvider depends on AuthProvider */}
                    <Header />
                    <main className="flex-grow container mx-auto px-4 py-8">
                      {children}
                    </main>
                    <Footer />
                    <Toaster />
                  </GiftRegistriesProvider>
                </OrdersProvider>
              </CartProvider>
            </WishlistProvider>
          </AddressesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

