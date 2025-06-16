
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
    description: 'A beautiful 100% silk scarf, perfect for any occasion. Features a vibrant floral pattern. This is an elegant piece that adds a touch of sophistication to any outfit. Made from the finest mulberry silk.',
    price: 49.99,
    originalPrice: 59.99,
    imageUrls: [
        'https://placehold.co/600x800.png',
        'https://placehold.co/100x120.png',
        'https://placehold.co/100x120.png',
        'https://placehold.co/100x120.png'
    ],
    dataAiHint: 'silk scarf floral',
    category: 'apparel',
    popularity: 85,
    trending: true,
    giftWrapAvailable: true,
    personalizedMessageAvailable: true,
    slug: 'luxury-silk-scarf',
    soldBy: 'Just4UGifts',
    availableColors: ['#FFC0CB', '#ADD8E6', '#90EE90'], // Pink, Light Blue, Light Green
    attributes: [
        { name: 'Material', value: '100% Mulberry Silk' },
        { name: 'Dimensions', value: '90cm x 90cm' },
        { name: 'Care', value: 'Dry clean only' }
    ],
    idealGiftFor: ['Fashion Enthusiasts', 'Birthdays', 'Anniversaries'],
    reviews: [
      { id: 'rev_1_1', author: 'Jane D.', rating: 5, comment: 'Absolutely stunning! The quality is amazing.', date: '2023-03-15' }
    ]
  },
  {
    id: 'prod_2',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Immerse yourself in sound with these premium over-ear headphones. Long battery life and comfortable design for extended listening sessions. Features active noise cancellation technology.',
    price: 199.99,
    imageUrls: [
        'https://placehold.co/600x800.png',
        'https://placehold.co/100x120.png',
        'https://placehold.co/100x120.png'
    ],
    dataAiHint: 'headphones audio tech',
    category: 'electronics',
    popularity: 92,
    trending: true,
    slug: 'wireless-headphones',
    soldBy: 'TechWorld',
    availableColors: ['#000000', '#FFFFFF', '#808080'], // Black, White, Grey
    attributes: [
        { name: 'Connectivity', value: 'Bluetooth 5.0' },
        { name: 'Battery Life', value: 'Up to 30 hours' },
        { name: 'Features', value: 'Active Noise Cancellation, Built-in Mic' }
    ],
    idealGiftFor: ['Music Lovers', 'Commuters', 'Gamers'],
    reviews: [
      { id: 'rev_2_1', author: 'Mike P.', rating: 5, comment: 'Best headphones I have ever owned!', date: '2023-04-01' },
      { id: 'rev_2_2', author: 'Sarah K.', rating: 4, comment: 'Great sound, a bit pricey but worth it.', date: '2023-04-05' }
    ]
  },
  {
    id: 'prod_3',
    name: 'Artisan Ceramic Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs. Each mug has a unique glaze finish, making every piece one-of-a-kind. Perfect for coffee or tea lovers.',
    price: 39.99,
    originalPrice: 45.00,
    imageUrls: [
        'https://placehold.co/600x800.png',
        'https://placehold.co/100x120.png'
    ],
    dataAiHint: 'ceramic mug coffee',
    category: 'home-goods',
    popularity: 78,
    giftWrapAvailable: true,
    slug: 'ceramic-mug-set',
    attributes: [
        { name: 'Set Includes', value: '4 Mugs' },
        { name: 'Material', value: 'Stoneware Ceramic' },
        { name: 'Capacity', value: '12 oz each' }
    ],
    idealGiftFor: ['Housewarmings', 'Coffee Aficionados', 'Hostess Gifts'],
  },
  {
    id: 'prod_4',
    name: 'Wooden Building Blocks Set',
    description: 'Classic wooden building blocks for creative play. Includes 100 pieces in various shapes and colors, fostering imagination and motor skills.',
    price: 29.99,
    imageUrls: [
        'https://placehold.co/600x800.png',
        'https://placehold.co/100x120.png',
        'https://placehold.co/100x120.png'
    ],
    dataAiHint: 'wooden blocks toys',
    category: 'toys-games',
    popularity: 88,
    personalizedMessageAvailable: true,
    slug: 'wooden-blocks-set',
    attributes: [
        { name: 'Piece Count', value: '100 Blocks' },
        { name: 'Material', value: 'Non-toxic Wood' },
        { name: 'Recommended Age', value: '3+ years' }
    ],
    idealGiftFor: ['Toddlers', 'Preschoolers', 'Creative Kids'],
  },
  {
    id: 'prod_5',
    name: 'Silver Heart Locket Necklace',
    description: 'Elegant sterling silver locket necklace, perfect for a cherished photo. Comes with an 18-inch chain. A timeless piece of jewelry.',
    price: 79.99,
    imageUrls: [
        'https://placehold.co/600x800.png',
        'https://placehold.co/100x120.png'
    ],
    dataAiHint: 'locket necklace silver',
    category: 'jewelry',
    popularity: 90,
    trending: true,
    giftWrapAvailable: true,
    personalizedMessageAvailable: true,
    slug: 'silver-locket-necklace',
    soldBy: "Just4UGifts",
    availableColors: ['silver'],
     attributes: [
        { name: 'Material', value: 'Sterling Silver (925)' },
        { name: 'Chain Length', value: '18 inches' },
        { name: 'Pendant Size', value: '20mm x 20mm' }
    ],
    idealGiftFor: ['Romantic Partners', 'Mother\'s Day', 'Keepsakes'],
  },
  {
    id: 'prod_6',
    name: 'Gourmet Chocolate Gift Box',
    description: 'A selection of fine artisanal chocolates. Beautifully packaged for gifting, featuring a variety of flavors and textures.',
    price: 34.99,
    originalPrice: 40.00,
    imageUrls: [
        'https://placehold.co/600x800.png',
        'https://placehold.co/100x120.png',
        'https://placehold.co/100x120.png'
    ],
    dataAiHint: 'chocolate box gourmet',
    category: 'occasions',
    popularity: 95,
    trending: true,
    giftWrapAvailable: true,
    slug: 'gourmet-chocolate-box',
    attributes: [
        { name: 'Variety', value: 'Dark, Milk, White Chocolate Assortment' },
        { name: 'Weight', value: '250g' },
        { name: 'Origin', value: 'Belgian Chocolate' }
    ],
    idealGiftFor: ['Any Occasion', 'Chocoholics', 'Thank You Gifts'],
  },
  {
    id: 'prod_7',
    name: 'Cozy Knit Throw Blanket',
    description: 'Soft and warm knit throw blanket, ideal for chilly evenings. Measures 50x60 inches. Adds a touch of comfort and style to any room.',
    price: 59.99,
    imageUrls: [
        'https://placehold.co/600x800.png',
         'https://placehold.co/100x120.png'
    ],
    dataAiHint: 'throw blanket cozy',
    category: 'home-goods',
    popularity: 82,
    slug: 'knit-throw-blanket',
    availableColors: ['#F5F5DC', '#A0522D', '#696969'], // Beige, Sienna, DimGray
    attributes: [
        { name: 'Material', value: 'Acrylic Blend' },
        { name: 'Dimensions', value: '50 inches x 60 inches' },
        { name: 'Care', value: 'Machine Washable' }
    ],
    idealGiftFor: ['Homebodies', 'Winter Gifting', 'Housewarmings'],
  },
  {
    id: 'prod_8',
    name: 'Smart Fitness Tracker',
    description: 'Track your steps, heart rate, and sleep patterns with this sleek fitness tracker. Syncs with your smartphone for detailed analytics and notifications.',
    price: 89.99,
    imageUrls: [
        'https://placehold.co/600x800.png',
        'https://placehold.co/100x120.png',
        'https://placehold.co/100x120.png'
    ],
    dataAiHint: 'fitness tracker smart',
    category: 'electronics',
    popularity: 75,
    trending: false,
    slug: 'smart-fitness-tracker',
    soldBy: "TechWorld",
    availableColors: ['#000000', '#1E90FF', '#FF69B4'], // Black, DodgerBlue, HotPink
    attributes: [
        { name: 'Sensors', value: 'Heart Rate, Accelerometer' },
        { name: 'Water Resistance', value: '5 ATM' },
        { name: 'Compatibility', value: 'iOS & Android' }
    ],
    idealGiftFor: ['Fitness Buffs', 'Health Conscious Individuals', 'Tech Enthusiasts'],
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(product => product.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter(product => product.category === categorySlug);
}
