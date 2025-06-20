
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
  Icon?: LucideIcon;
  dataAiHint?: string;
}
export interface GiftType extends BaseCategory {
   Icon?: LucideIcon;
}
export interface Recipient extends BaseCategory {
  Icon?: LucideIcon;
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
  icon?: LucideIcon;
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

// ---- New Types for RTDB Integration ----
export interface UserProfileDetails {
  phoneNumber?: string;
  age?: string;
}

export interface Address {
  id: string; // Firebase key
  label: string; // e.g., "Home", "Work"
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phoneNumber?: string; // Added phone number
  isDefault?: boolean;
}

export interface CartRtdbItem {
  productId: string; // Keep for clarity, though key is productId
  quantity: number;
  addedAt?: string; // ISO timestamp
}

// Wishlist in RTDB will store product IDs as keys, value can be true or timestamp
// export type WishlistRtdb = Record<string, boolean | string>;

export interface OrderItem extends Product { // Or a simplified version
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string; // Firebase key
  orderDate: string; // ISO timestamp
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
}

export interface GiftRegistryItem {
  productId: string;
  desiredQuantity: number;
  fulfilledQuantity: number;
}

export interface GiftRegistry {
  id: string; // Firebase key
  name: string;
  eventDate: string; // ISO timestamp or simple date
  description?: string;
  creatorUid: string;
  isPublic: boolean;
  items: Record<string, GiftRegistryItem>; // Product ID as key
  shippingAddress?: Address;
}
