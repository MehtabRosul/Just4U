
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
// import TopUtilityBar from '@/components/layout/TopUtilityBar'; // Removed
// import GlobalNavBar from '@/components/layout/GlobalNavBar'; // Removed
import { WishlistProvider } from '@/hooks/useWishlist';
import { AuthProvider } from '@/hooks/useAuth'; // Import AuthProvider

export const metadata: Metadata = {
  title: 'Just4U - Gift with Personal Touch',
  description: 'Curated gift ideas from Just4U, with a personal touch for every occasion.',
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
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <AuthProvider> {/* Wrap with AuthProvider */}
          <WishlistProvider>
            {/* <TopUtilityBar /> // Removed */}
            <Header />
            {/* <GlobalNavBar /> // Removed */}
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            <Toaster />
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
