
import type { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrls: string[];
  dataAiHint?: string;
  category: string; // Corresponds to GiftType slug
  occasion?: string[]; // Slugs of occasions
  recipient?: string[]; // Slugs of recipients
  popularity: number;
  trending?: boolean;
  giftWrapAvailable?: boolean;
  personalizedMessageAvailable?: boolean;
  reviews?: Review[];
  slug: string;
  soldBy?: string;
  availableColors?: string[];
  attributes?: Array<{ name: string; value: string }>;
  idealGiftFor?: string[]; // Legacy, can be mapped from recipient/occasion
  customizable?: boolean; // For "Customize Now" button
  countdownEndTime?: string; // For "Deal of the Day"
}

export interface BaseCategory {
  id: string;
  name: string;
  slug: string;
  dataAiHint?: string; // For placeholder images
}

export interface Occasion extends BaseCategory {
  Icon?: LucideIcon; // Retained for OccasionSpotlight
}
export interface GiftType extends BaseCategory {
   Icon?: LucideIcon; // Retained for GiftTypeHighlight if specific icons are preferred over images later
}
export interface Recipient extends BaseCategory {
  // Icon property is removed as we are moving to images for RecipientQuickLinks
}

// Legacy Category type, maps to GiftType now
export interface Category extends GiftType {}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface WishlistItem extends Product {}

// NavItem is generic for different nav menus
export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon; // Retained for potential use elsewhere
  children?: NavItem[]; // For dropdowns/mega-menus
  megaMenuColumns?: MegaMenuColumn[];
}

export interface MegaMenuColumn {
  title: string;
  links: NavItem[];
  showBestsellers?: boolean; // Placeholder for future content
  showTrendingPicks?: boolean; // Placeholder for future content
}

// Type for Top Utility Bar Links
export interface UtilityLink {
  label: string;
  href: string;
}
