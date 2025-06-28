
import type { NavItem, UtilityLink, Occasion, GiftType, Recipient } from '@/lib/types';
import { OCCASIONS_LIST, GIFT_TYPES_LIST, RECIPIENTS_LIST } from '@/lib/data';
import { Briefcase, Percent, MapPin, HelpCircle, ShoppingBag, Gift, Users, HomeIcon as HomeIconLucide, ToyBrick, Palette, Music, Package, Sparkles as SparklesIcon, Heart, Star, User } from 'lucide-react'; // Added more icons for GLOBAL_NAV_LINKS

export const SITE_TITLE = "Just4U";
export const SITE_DESCRIPTION = "Find the perfect gift, curated just for you with a personal touch.";

// For Top Utility Bar
export const TOP_UTILITY_LINKS: UtilityLink[] = [
  { label: 'Bulk Orders', href: '/products?category=corporate-gifts' }, // Point to a relevant corporate category
  { label: 'Track Order', href: 'https://just4ugifts.com/track' }, // External link
  { label: 'My Reminders', href: '/account/reminders' }, // Placeholder for reminders page
];

// For Global Navigation Bar
// Grouping gift types for cleaner nav, or list top few.
const NAV_GIFT_TYPES_SUBSET = GIFT_TYPES_LIST.filter(gt => [
    'photo-gifts-general', 'mini-you-series', '3d-crystals', 'photo-frames', 'utility-mugs', 'gift-hampers'
].includes(gt.slug));

export const GLOBAL_NAV_LINKS: NavItem[] = [
  {
    label: 'Occasions',
    href: '#',
    icon: SparklesIcon,
    children: OCCASIONS_LIST.slice(0, 12).map(o => ({ label: o.name, href: `/products?occasion=${o.slug}` })), // Show a subset for brevity
  },
  {
    label: 'Gift Types',
    href: '#',
    icon: Gift,
    children: NAV_GIFT_TYPES_SUBSET.map(gt => ({ label: gt.name, href: `/products?category=${gt.slug}` })),
  },
  {
    label: 'For Whom',
    href: '#',
    icon: Users,
    children: RECIPIENTS_LIST.slice(0,10).map(r => ({ label: r.name, href: `/products?recipient=${r.slug}` })), // Show a subset
  },
  { label: 'Personalised Gifts', href: '/products?category=photo-gifts-general', icon: Palette }, // Main personalized category
  { label: 'Mini You Series', href: '/products?category=mini-you-series', icon: ToyBrick },
  { label: 'Corporate Gifts', href: '/products?category=corporate-gifts', icon: Briefcase }, // Main corporate category
  // { label: 'Offers', href: '/offers', icon: Percent }, // Can be added back if an offers page exists
  // { label: 'Store Locator', href: '/store-locator', icon: MapPin },
  // { label: 'Help', href: '/help', icon: HelpCircle },
];


// NAV_LINKS from previous design (used in mobile sheet menu or simple fallback)
// This is now primarily sourced from GLOBAL_NAV_LINKS in Header.tsx for mobile menu.
export const NAV_LINKS: NavItem[] = GLOBAL_NAV_LINKS;


// Legacy footer links, can be updated/merged if needed
export const FOOTER_LINKS = {
  social: [
    { name: 'Facebook', href: '#', icon: () => null }, // Placeholder, icons managed in Footer.tsx
    { name: 'Twitter', href: '#', icon: () => null },
    { name: 'Instagram', href: '#', icon: () => null },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' }, // Example link
    { name: 'Privacy Policy', href: '/privacy' }, // Example link
  ],
  company: [
    { name: 'About Us', href: '/about' }, // Example link
    { name: 'Contact', href: '/contact' }, // Example link
    { name: 'Track Orders', href: '/account/orders' },
  ]
};
