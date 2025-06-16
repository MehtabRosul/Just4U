
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Home, ShoppingBag, Heart, ClipboardList } from 'lucide-react';
import type { NavItem } from '@/lib/types';

// Define SVG Icon Components
const FacebookIcon: React.FC = () => {
  return (
    <svg 
      className="w-5 h-5" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      stroke="currentColor" /* Assuming stroke might be desired */
      strokeWidth="0" /* Default to 0 if primarily filled, adjust if outline needed */
      strokeLineCap="round" 
      strokeLineJoin="round"
    >
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
};

const TwitterIcon: React.FC = () => {
  return (
    <svg 
      className="w-5 h-5" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      stroke="currentColor" /* Assuming stroke might be desired */
      strokeWidth="0" /* Default to 0 if primarily filled, adjust if outline needed */
      strokeLineCap="round" 
      strokeLineJoin="round"
    >
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    </svg>
  );
};

const InstagramIcon: React.FC = () => {
  return (
    <svg 
      className="w-5 h-5" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLineCap="round" 
      strokeLineJoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
    </svg>
  );
};


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
    { name: 'Facebook', href: '#', icon: FacebookIcon },
    { name: 'Twitter', href: '#', icon: TwitterIcon },
    { name: 'Instagram', href: '#', icon: InstagramIcon },
  ],
  legal: [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Order Tracking', href: 'https://just4ugifts.com/track' }
  ]
};
