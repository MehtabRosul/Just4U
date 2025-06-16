
import type { NavItem } from '@/lib/types';
import { Home, ShoppingBag, Heart, ClipboardList } from 'lucide-react';

export const SITE_TITLE = "Just4UGifts Curator";
export const SITE_DESCRIPTION = "Find the perfect gift, curated just for you.";

export const NAV_LINKS: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'All Gifts', href: '/products', icon: ShoppingBag },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Registries', href: '/registries', icon: ClipboardList },
];

export const FOOTER_LINKS = {
  social: [
    { name: 'Facebook', href: '#', icon: () => <svg fill="currentColor" strokeLineCap="round" strokeLineJoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg> },
    { name: 'Twitter', href: '#', icon: () => <svg fill="currentColor" strokeLineCap="round" strokeLineJoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg> },
    { name: 'Instagram', href: '#', icon: () => <svg fill="none" stroke="currentColor" strokeLineCap="round" strokeLineJoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg> },
  ],
  legal: [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Order Tracking', href: 'https://just4ugifts.com/track' } // Example external link
  ]
};
