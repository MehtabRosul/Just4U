
import Link from 'next/link';
import { SiteLogo } from './SiteLogo';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter } from 'lucide-react'; 
import Image from 'next/image';

const footerSections = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Client Testimonial', href: '/testimonials' },
    { name: 'Track Orders', href: 'https://just4ugifts.com/track' },
    { name: 'Shop', href: '/products' },
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'Profile', href: '/account' },
  ],
  product: [
    { name: 'Custom Gifts', href: '/products?category=photo-gifts-general' }, // Updated
    { name: 'Mini You', href: '/custom/mini-you' },
    { name: 'Trophy', href: '/products?category=corporate-gifts' }, // Updated
    { name: 'Memento', href: '/products?category=corporate-gifts' }, // Updated
    { name: 'Joining Kits', href: '/products?category=corporate-gifts' }, // Updated
    { name: 'Our Anniversary Gifts', href: '/products?occasion=anniversary' },
    { name: 'Our Birthday Gifts', href: '/products?occasion=birthday' },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: '#', Icon: Facebook },
  { name: 'Instagram', href: '#', Icon: Instagram },
  { name: 'Twitter', href: '#', Icon: Twitter },
];

const paymentMethods = [
  { name: 'Visa', imageUrl: 'https://placehold.co/60x35/ffffff/000000.png?text=VISA&font=roboto', dataAiHint: 'visa logo' },
  { name: 'Mastercard', imageUrl: 'https://placehold.co/60x35/ffffff/000000.png?text=Mastercard&font=roboto', dataAiHint: 'mastercard logo' },
  { name: 'PayPal', imageUrl: 'https://placehold.co/60x35/ffffff/000000.png?text=PayPal&font=roboto', dataAiHint: 'paypal logo' },
  { name: 'Google Pay', imageUrl: 'https://placehold.co/60x35/ffffff/000000.png?text=GPay&font=roboto', dataAiHint: 'google pay logo' },
  { name: 'Apple Pay', imageUrl: 'https://placehold.co/60x35/ffffff/000000.png?text=ApplePay&font=roboto', dataAiHint: 'apple pay logo' },
  { name: 'Razorpay', imageUrl: 'https://placehold.co/80x35/1D2C5A/FFFFFF.png?text=Razorpay&font=roboto', dataAiHint: 'razorpay logo' },
];

export default function Footer() {
  return (
    <footer className="bg-black text-neutral-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & Info */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <SiteLogo className="mb-3" />
            <p className="text-sm leading-relaxed text-neutral-400">
              It's your one-stop online destination for unique and thoughtful gifts. Browse our curated collection of personalized items, luxury goods, and sentimental keepsakes. Make someone's day special with our hassle-free shipping and gift wrapping services.
            </p>
            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium text-neutral-200">Follow us for more Updates</p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <Link key={social.name} href={social.href} target="_blank" rel="noopener noreferrer"
                     className="text-neutral-400 hover:text-primary transition-colors"
                     aria-label={social.name}>
                    <social.Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="pt-3 space-y-3">
              <Button asChild className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 text-sm">
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <div>
                <Link href="/faqs" className="text-sm text-neutral-400 hover:text-primary transition-colors">
                  FAQs
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Payment Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Payment Method</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Yes, shopping at Just4U is 100% safe. All Credit card and Debit card payments on Just4U are processed through secure and trusted payment gateways.
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              {paymentMethods.map((method) => (
                <div key={method.name} className="p-1 bg-white rounded-sm shadow-sm flex items-center justify-center h-[30px]">
                  <Image
                    src={method.imageUrl}
                    alt={method.name}
                    width={method.name === 'Razorpay' ? 70 : 50}
                    height={25}
                    className="object-contain"
                    data-ai-hint={method.dataAiHint}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Company</h3>
            <ul className="space-y-2">
              {footerSections.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-neutral-300 hover:text-primary transition-colors" target={link.href.startsWith('http') ? '_blank' : '_self'}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Product */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-100">Product</h3>
            <ul className="space-y-2">
              {footerSections.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-neutral-300 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-neutral-500">
          <p>
            Copyright &copy; {new Date().getFullYear()} by <span className="text-primary">Just4U</span>. All Rights Reserved
            <span className="mx-1 sm:mx-2">||</span>
            Design & Developed by <Link href="https://www.rosulmehtab.tech/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mehtab Rosul</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
