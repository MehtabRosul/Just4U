import type { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  dataAiHint?: string;
  category: string;
  popularity: number; // e.g., view count or sales rank
  trending?: boolean;
  giftWrapAvailable?: boolean;
  personalizedMessageAvailable?: boolean;
  reviews?: Review[];
  slug: string; // for URL path
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
