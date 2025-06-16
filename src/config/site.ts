
import type { NavItem, UtilityLink, Occasion, GiftType, Recipient } from '@/lib/types';
import { OCCASIONS_LIST, GIFT_TYPES_LIST, RECIPIENTS_LIST } from '@/lib/data';
import { Briefcase, Percent, MapPin, HelpCircle } from 'lucide-react';

export const SITE_TITLE = "Just4U";
export const SITE_DESCRIPTION = "Find the perfect gift, curated just for you with a personal touch.";

// For Top Utility Bar
export const TOP_UTILITY_LINKS: UtilityLink[] = [
  { label: 'Bulk Orders', href: '/corporate-gifts' }, // Assuming corporate gifts page handles bulk
  { label: 'Track Order', href: 'https://just4ugifts.com/track' }, // External link
  { label: 'My Reminders', href: '/account/reminders' }, // Placeholder for reminders page
];

// For Global Navigation Bar
export const GLOBAL_NAV_LINKS: NavItem[] = [
  {
    label: 'Select Occasion',
    href: '#', // '#' because it's a dropdown trigger
    children: OCCASIONS_LIST.map(o => ({ label: o.name, href: `/products?occasion=${o.slug}` })),
    // megaMenuColumns: [ /* Define mega menu structure here later */ ]
  },
  {
    label: 'Select Gift Type',
    href: '#',
    children: GIFT_TYPES_LIST.map(gt => ({ label: gt.name, href: `/products?category=${gt.slug}` })),
    // megaMenuColumns: [ /* Define mega menu structure here later */ ]
  },
  {
    label: 'Recipient',
    href: '#',
    children: RECIPIENTS_LIST.map(r => ({ label: r.name, href: `/products?recipient=${r.slug}` })),
    // megaMenuColumns: [ /* Define mega menu structure here later */ ]
  },
  { label: 'Corporate Gifts', href: '/corporate-gifts', icon: Briefcase },
  { label: 'Offers', href: '/offers', icon: Percent },
  { label: 'Store Locator', href: '/store-locator', icon: MapPin },
  { label: 'Help', href: '/help', icon: HelpCircle },
];

// NAV_LINKS from previous design (used in mobile sheet menu or simple fallback)
// This can be deprecated or merged if Global Nav handles all primary navigation.
// For now, let's keep it minimal as primary nav moves to GlobalNavBar.
export const NAV_LINKS: NavItem[] = [
  // These links are now primarily in GlobalNavBar.
  // The mobile menu might source from GLOBAL_NAV_LINKS.
  // { label: 'Corporate Gifts', href: '/corporate-gifts' },
  // { label: 'Personalized Gifts', href: '/products?category=photo-gifts' }, // Example mapping
  // { label: 'Occasions', href: '/products' }, // Generic occasions link
  // { label: 'Create Mini You', href: '/custom/mini-you' },
];


// Legacy footer links, can be updated/merged if needed
export const FOOTER_LINKS = {
  social: [
    // Define actual SVG components or use lucide icons if preferred
    { name: 'Facebook', href: '#', icon: () => null },
    { name: 'Twitter', href: '#', icon: () => null },
    { name: 'Instagram', href: '#', icon: () => null },
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
