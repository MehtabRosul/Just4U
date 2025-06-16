import type { Category, Product } from './types';
import { Gift, Shirt, Smartphone, HomeIcon as Home, ToyBrick, Gem } from 'lucide-react';

export const CATEGORIES: Category[] = [
  { id: 'apparel', name: 'Apparel', Icon: Shirt, slug: 'apparel', dataAiHint: "clothing fashion" },
  { id: 'electronics', name: 'Electronics', Icon: Smartphone, slug: 'electronics', dataAiHint: "gadgets tech" },
  { id: 'home-goods', name: 'Home Goods', Icon: Home, slug: 'home-goods', dataAiHint: "house decor" },
  { id: 'toys-games', name: 'Toys & Games', Icon: ToyBrick, slug: 'toys-games', dataAiHint: "play kids" },
  { id: 'jewelry', name: 'Jewelry', Icon: Gem, slug: 'jewelry', dataAiHint: "accessories luxury" },
  { id: 'occasions', name: 'Occasions', Icon: Gift, slug: 'occasions', dataAiHint: "celebration present" },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Luxury Silk Scarf',
    description: 'A beautiful 100% silk scarf, perfect for any occasion. Features a vibrant floral pattern.',
    price: 49.99,
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'silk scarf',
    category: 'apparel',
    popularity: 85,
    trending: true,
    giftWrapAvailable: true,
    personalizedMessageAvailable: true,
    slug: 'luxury-silk-scarf',
    reviews: [
      { id: 'rev_1_1', author: 'Jane D.', rating: 5, comment: 'Absolutely stunning! The quality is amazing.', date: '2023-03-15' }
    ]
  },
  {
    id: 'prod_2',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Immerse yourself in sound with these premium over-ear headphones. Long battery life and comfortable design.',
    price: 199.99,
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'headphones audio',
    category: 'electronics',
    popularity: 92,
    trending: true,
    slug: 'wireless-headphones',
    reviews: [
      { id: 'rev_2_1', author: 'Mike P.', rating: 5, comment: 'Best headphones I have ever owned!', date: '2023-04-01' },
      { id: 'rev_2_2', author: 'Sarah K.', rating: 4, comment: 'Great sound, a bit pricey but worth it.', date: '2023-04-05' }
    ]
  },
  {
    id: 'prod_3',
    name: 'Artisan Ceramic Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs. Each mug has a unique glaze finish.',
    price: 39.99,
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'ceramic mug',
    category: 'home-goods',
    popularity: 78,
    giftWrapAvailable: true,
    slug: 'ceramic-mug-set',
  },
  {
    id: 'prod_4',
    name: 'Wooden Building Blocks Set',
    description: 'Classic wooden building blocks for creative play. Includes 100 pieces in various shapes and colors.',
    price: 29.99,
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'wooden blocks',
    category: 'toys-games',
    popularity: 88,
    personalizedMessageAvailable: true,
    slug: 'wooden-blocks-set',
  },
  {
    id: 'prod_5',
    name: 'Silver Heart Locket Necklace',
    description: 'Elegant sterling silver locket necklace, perfect for a cherished photo. Comes with an 18-inch chain.',
    price: 79.99,
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'locket necklace',
    category: 'jewelry',
    popularity: 90,
    trending: true,
    giftWrapAvailable: true,
    personalizedMessageAvailable: true,
    slug: 'silver-locket-necklace',
  },
  {
    id: 'prod_6',
    name: 'Gourmet Chocolate Gift Box',
    description: 'A selection of fine artisanal chocolates. Beautifully packaged for gifting.',
    price: 34.99,
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'chocolate box',
    category: 'occasions',
    popularity: 95,
    trending: true,
    giftWrapAvailable: true,
    slug: 'gourmet-chocolate-box',
  },
  {
    id: 'prod_7',
    name: 'Cozy Knit Throw Blanket',
    description: 'Soft and warm knit throw blanket, ideal for chilly evenings. Measures 50x60 inches.',
    price: 59.99,
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'throw blanket',
    category: 'home-goods',
    popularity: 82,
    slug: 'knit-throw-blanket',
  },
  {
    id: 'prod_8',
    name: 'Smart Fitness Tracker',
    description: 'Track your steps, heart rate, and sleep patterns with this sleek fitness tracker. Syncs with your smartphone.',
    price: 89.99,
    imageUrl: 'https://placehold.co/300x400.png',
    dataAiHint: 'fitness tracker',
    category: 'electronics',
    popularity: 75,
    trending: false,
    slug: 'smart-fitness-tracker',
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(product => product.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter(product => product.category === categorySlug);
}
