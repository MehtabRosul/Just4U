
import type { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // This will be the current/discounted price
  originalPrice?: number; // Optional original price
  imageUrls: string[]; // Changed from imageUrl to support multiple images
  dataAiHint?: string;
  category: string;
  popularity: number; // e.g., view count or sales rank
  trending?: boolean;
  giftWrapAvailable?: boolean;
  personalizedMessageAvailable?: boolean;
  reviews?: Review[];
  slug: string;
  soldBy?: string;
  availableColors?: string[]; // e.g., ['#FF0000', '#00FF00', '#0000FF'] or ['Red', 'Green', 'Blue']
  attributes?: Array<{ name: string; value: string }>; // For "Key Product Attributes"
  idealGiftFor?: string[]; // For "An ideal gift for"
}

export interface Category {
  id: string;
  name: string;
  Icon?: LucideIcon;
  slug: string;
  dataAiHint?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface WishlistItem extends Product {}

export interface GiftRegistryItem extends Product {
  quantityDesired: number;
  quantityFulfilled: number;
}

export interface GiftRegistry {
  id: string;
  name: string;
  occasion: string;
  date: string; // ISO date string
  items: GiftRegistryItem[];
  isPublic?: boolean;
  shareUrl?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}
