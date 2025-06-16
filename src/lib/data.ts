
import type { Occasion, GiftType, Recipient, Product, Category } from './types';
import { Gift, Shirt, Smartphone, HomeIcon as Home, ToyBrick, Gem, Users, ShoppingBag, MapPin, HelpCircle, Briefcase, Percent, Star, User, Heart, ShoppingCart as CartIconLucide, Anchor, Award, Baby, Cake, CalendarDays, Camera, Car, Crown, Diamond, Drama, Feather, Flag, Flower, Gamepad, Globe, GraduationCap, HandHeart, History, Lamp, Leaf, Medal, Moon, Mountain, Music, Newspaper, Package, Palette, PartyPopper, Pencil, Pin, Plane, Puzzle, Rocket, School, Search, Shield, Smile, Sparkles, Sprout, Store, Sun, Tag, ThumbsUp, Ticket, TreeDeciduous, Trophy, Utensils, Wand, Watch, Wind, Wine, Zap } from 'lucide-react';

// New Data based on specification
export const OCCASIONS_LIST: Occasion[] = [
  { id: 'birthday', name: 'Birthday', slug: 'birthday', Icon: Cake },
  { id: 'anniversary', name: 'Anniversary', slug: 'anniversary', Icon: Diamond },
  { id: 'wedding', name: 'Wedding', slug: 'wedding', Icon: HandHeart },
  { id: 'house-warming', name: 'House Warming', slug: 'house-warming', Icon: Home },
  { id: 'farewell', name: 'Farewell', slug: 'farewell', Icon: Plane },
  { id: 'baby-shower', name: 'Baby Shower', slug: 'baby-shower', Icon: Baby },
  { id: 'valentines-day', name: "Valentine's Day", slug: 'valentines-day', Icon: Heart },
  { id: 'womens-day', name: "Women's Day", slug: 'womens-day', Icon: Sparkles }, // Placeholder icon
  { id: 'mothers-day', name: "Mother's Day", slug: 'mothers-day', Icon: Flower },
  { id: 'fathers-day', name: "Father's Day", slug: 'fathers-day', Icon: User }, // Placeholder icon
  { id: 'parents-day', name: "Parents' Day", slug: 'parents-day', Icon: Users },
  { id: 'teachers-day', name: "Teacher's Day", slug: 'teachers-day', Icon: GraduationCap },
  { id: 'childrens-day', name: "Children's Day", slug: 'childrens-day', Icon: Smile },
  { id: 'new-year', name: 'New Year', slug: 'new-year', Icon: PartyPopper },
  { id: 'grandparents-day', name: "Grandparents' Day", slug: 'grandparents-day', Icon: Users }, // Placeholder
  { id: 'rakhi', name: 'Rakhi', slug: 'rakhi', Icon: Gift }, // Placeholder
  { id: 'durga-puja', name: 'Durga Puja', slug: 'durga-puja', Icon: Drama }, // Placeholder
  { id: 'karva-chauth', name: 'Karva Chauth', slug: 'karva-chauth', Icon: Moon }, // Placeholder
  { id: 'diwali-bhaidooj', name: 'Diwali & Bhaidooj', slug: 'diwali-bhaidooj', Icon: Lamp },
  { id: 'christmas', name: 'Christmas', slug: 'christmas', Icon: TreeDeciduous },
  { id: 'holi', name: 'Holi', slug: 'holi', Icon: Palette },
  { id: 'poila-baisakh', name: 'Poila Baisakh', slug: 'poila-baisakh', Icon: CalendarDays }, // Placeholder
  { id: 'onam', name: 'Onam', slug: 'onam', Icon: Flower }, // Placeholder
  { id: 'bihu', name: 'Bihu', slug: 'bihu', Icon: Music }, // Placeholder
  { id: 'welcome-kits', name: 'Welcome Kits', slug: 'welcome-kits', Icon: Package },
  { id: 'memento', name: 'Memento', slug: 'memento', Icon: Award },
  { id: 'trophies-awards', name: 'Trophies & Awards', slug: 'trophies-awards', Icon: Trophy },
];

export const GIFT_TYPES_LIST: GiftType[] = [
  { id: 'caricature', name: 'Caricature', slug: 'caricature', Icon: Smile, dataAiHint: "custom caricature art"},
  { id: 'miniature', name: 'Miniature', slug: 'miniature', Icon: User, dataAiHint: "3d miniature figure"}, // Using User as placeholder
  { id: 'photo-frames', name: 'Photo Frames', slug: 'photo-frames', Icon: Camera, dataAiHint: "picture frame decor"},
  { id: 'bobblehead', name: 'Bobblehead', slug: 'bobblehead', Icon: User, dataAiHint: "custom bobblehead doll"}, // Placeholder
  { id: '3d-crystals', name: '3D Crystals', slug: '3d-crystals', Icon: Gem, dataAiHint: "crystal engraving gift"},
  { id: '3d-lamps', name: '3D Lamps', slug: '3d-lamps', Icon: Lamp, dataAiHint: "custom 3d light"},
  { id: 'clocks', name: 'Clocks', slug: 'clocks', Icon: Watch, dataAiHint: "wall clock gift"},
  { id: 'wooden-plaques', name: 'Wooden Plaques', slug: 'wooden-plaques', Icon: Shield, dataAiHint: "engraved wood plaque"}, // Placeholder
  { id: 'photo-collage', name: 'Photo Collage', slug: 'photo-collage', Icon: Newspaper, dataAiHint: "picture collage frame"}, // Placeholder
  { id: 'custom-mugs', name: 'Custom Mugs', slug: 'custom-mugs', Icon: Utensils, dataAiHint: "personalized mug coffee"}, // Placeholder for coffee mug
  { id: 'photo-book-album', name: 'Photo Book Album', slug: 'photo-book-album', Icon: Newspaper, dataAiHint: "custom photo album"},
  { id: 'photo-gifts', name: 'Photo Gifts', slug: 'photo-gifts', Icon: Gift, dataAiHint: "personalized photo present"},
  { id: 'bar-accessories', name: 'Bar Accessories', slug: 'bar-accessories', Icon: Wine, dataAiHint: "barware tools gift"},
  { id: 'magnet-tags', name: 'Magnet & Tags', slug: 'magnet-tags', Icon: Tag, dataAiHint: "custom magnet label"},
  { id: 'home-decor', name: 'Home Decor', slug: 'home-decor', Icon: Home, dataAiHint: "house decoration item"},
  { id: 'bags', name: 'Bags', slug: 'bags', Icon: ShoppingBag, dataAiHint: "custom tote bag"},
  { id: 'chocolates', name: 'Chocolates', slug: 'chocolates', Icon: Gift, dataAiHint: "gourmet chocolate box"}, // Placeholder
  { id: 'name-plate', name: 'Name Plate', slug: 'name-plate', Icon: Pin, dataAiHint: "custom door nameplate"}, // Placeholder
  { id: 't-shirt', name: 'T-shirt', slug: 't-shirt', Icon: Shirt, dataAiHint: "custom printed tshirt"},
  { id: 'digital-gifts', name: 'Digital Gifts', slug: 'digital-gifts', Icon: Smartphone, dataAiHint: "online digital present"},
  { id: 'stone-tiles', name: 'Stone & Tiles', slug: 'stone-tiles', Icon: Gem, dataAiHint: "engraved stone tile"}, // Placeholder
  { id: 'keychain', name: 'Keychain', slug: 'keychain', Icon: Anchor, dataAiHint: "custom photo keychain"}, // Placeholder
  { id: 'pens', name: 'Pens', slug: 'pens', Icon: Pencil, dataAiHint: "engraved pen gift"},
  { id: 'photo-to-art', name: 'Photo To Art', slug: 'photo-to-art', Icon: Palette, dataAiHint: "custom art portrait"},
  { id: 'canvas-print', name: 'Canvas Print', slug: 'canvas-print', Icon: Newspaper, dataAiHint: "photo canvas wallart"}, // Placeholder
  { id: 'digital-sketch', name: 'Digital Sketch', slug: 'digital-sketch', Icon: Pencil, dataAiHint: "custom sketch portrait"}, // Placeholder
  { id: 'shadow-box', name: 'Shadow Box', slug: 'shadow-box', Icon: Package, dataAiHint: "3d shadow box frame"},
  { id: 'heart-products', name: 'Heart Products', slug: 'heart-products', Icon: Heart, dataAiHint: "heart shape gift"},
  { id: 'framed-bobblehead', name: 'Framed Bobblehead', slug: 'framed-bobblehead', Icon: User, dataAiHint: "bobblehead display case"}, // Placeholder
  { id: 'profession-series', name: 'Profession Series', slug: 'profession-series', Icon: Briefcase, dataAiHint: "professional themed gift"},
  { id: 'superhero-series', name: 'Superhero Series', slug: 'superhero-series', Icon: Zap, dataAiHint: "superhero merchandise"}, // Placeholder
  { id: 'bust', name: 'Bust', slug: 'bust', Icon: User, dataAiHint: "custom bust statue"}, // Placeholder
  { id: 'home-living', name: 'Home & Living', slug: 'home-living', Icon: Home, dataAiHint: "lifestyle home product"}, // Duplicate of Home Decor, adjust if needed
  { id: 'wall-art', name: 'Wall Art', slug: 'wall-art', Icon: Palette, dataAiHint: "decorative wall hanging"}, // Placeholder
  { id: 'nameplates', name: 'Nameplates', slug: 'nameplates', Icon: Pin, dataAiHint: "custom desk nameplate"}, // Duplicate, adjust
  { id: 'cushion', name: 'Cushion', slug: 'cushion', Icon: ToyBrick, dataAiHint: "personalized photo cushion"}, // Placeholder
  { id: 'kitchen-barware', name: 'Kitchen & Barware', slug: 'kitchen-barware', Icon: Utensils, dataAiHint: "kitchen tools barware"},
  { id: 'metal-prints', name: 'Metal Prints', slug: 'metal-prints', Icon: Newspaper, dataAiHint: "photo print metal"}, // Placeholder
  { id: 'photo-tiles', name: 'Photo Tiles', slug: 'photo-tiles', Icon: Gem, dataAiHint: "custom ceramic tile"}, // Placeholder
  { id: 'sketch-painting', name: 'Sketch & Painting', slug: 'sketch-painting', Icon: Palette, dataAiHint: "hand drawn painting"},
  { id: 'motivational-quotes', name: 'Motivational Quotes', slug: 'motivational-quotes', Icon: ThumbsUp, dataAiHint: "inspirational quote frame"},
  { id: 'tabletop-decor', name: 'Tabletop Decor', slug: 'tabletop-decor', Icon: Leaf, dataAiHint: "desk decoration ornament"}, // Placeholder
  { id: 'wooden-prints', name: 'Wooden Prints', slug: 'wooden-prints', Icon: Newspaper, dataAiHint: "photo print wood"}, // Placeholder
  { id: 'flowers', name: 'Flowers', slug: 'flowers', Icon: Flower, dataAiHint: "fresh flower bouquet"},
  { id: 'best-seller-flower', name: 'Best Seller Flower', slug: 'best-seller-flower', Icon: Flower, dataAiHint: "popular flower arrangement"},
  { id: 'seasonal-flower', name: 'Seasonal Flower', slug: 'seasonal-flower', Icon: Sprout, dataAiHint: "seasonal bloom bouquet"},
  { id: 'vase-collection', name: 'Vase Collection', slug: 'vase-collection', Icon: Wine, dataAiHint: "decorative flower vase"}, // Placeholder
  { id: 'bouquet-collection', name: 'Bouquet Collection', slug: 'bouquet-collection', Icon: Flower, dataAiHint: "flower bouquet gift"},
  { id: 'gift-combos', name: 'Gift Combos', slug: 'gift-combos', Icon: Package, dataAiHint: "gift set hamper"},
  { id: 'desk-accessories', name: 'Desk Accessories', slug: 'desk-accessories', Icon: Pencil, dataAiHint: "office desk organizer"},
  { id: 'medals', name: 'Medals', slug: 'medals', Icon: Medal, dataAiHint: "custom award medal"},
  { id: 'crystal-awards', name: 'Crystal Awards', slug: 'crystal-awards', Icon: Gem, dataAiHint: "engraved crystal trophy"},
  { id: 'class-trophies', name: 'Class Trophies', slug: 'class-trophies', Icon: Trophy, dataAiHint: "school award trophy"},
  { id: 'acrylic-trophies', name: 'Acrylic Trophies', slug: 'acrylic-trophies', Icon: Award, dataAiHint: "custom acrylic award"},
  { id: 'office-stationery', name: 'Office Stationery', slug: 'office-stationery', Icon: School, dataAiHint: "corporate stationery gift"}, // Placeholder
  { id: 'glassware', name: 'Glassware', slug: 'glassware', Icon: Wine, dataAiHint: "engraved glass gift"},
  { id: 'name-badges', name: 'Name Badges', slug: 'name-badges', Icon: Pin, dataAiHint: "custom name tag"},
  { id: 'premium-gifts', name: 'Premium Gifts', slug: 'premium-gifts', Icon: Diamond, dataAiHint: "luxury executive gift"},
  { id: 'bottles', name: 'Bottles', slug: 'bottles', Icon: Package, dataAiHint: "custom water bottle"}, // Placeholder
  { id: 'gift-boxes', name: 'Gift Boxes', slug: 'gift-boxes', Icon: Package, dataAiHint: "empty gift box"},
  { id: 'coasters', name: 'Coasters', slug: 'coasters', Icon: Utensils, dataAiHint: "custom photo coaster"}, // Placeholder
];

export const RECIPIENTS_LIST: Recipient[] = [
  { id: 'men', name: 'Men', slug: 'men', Icon: User },
  { id: 'husband', name: 'Husband', slug: 'husband', Icon: User },
  { id: 'father', name: 'Father', slug: 'father', Icon: User },
  { id: 'winner', name: 'Winner', slug: 'winner', Icon: Trophy }, // Generic winner
  { id: 'male-friend', name: 'Male Friend', slug: 'male-friend', Icon: User },
  { id: 'boyfriend', name: 'Boyfriend', slug: 'boyfriend', Icon: User },
  { id: 'son', name: 'Son', slug: 'son', Icon: User },
  { id: 'brother', name: 'Brother', slug: 'brother', Icon: User },
  { id: 'grandfather', name: 'Grandfather', slug: 'grandfather', Icon: User },
  { id: 'boy-child', name: 'Boy Child', slug: 'boy-child', Icon: User },
  { id: 'women', name: 'Women', slug: 'women', Icon: User },
  { id: 'wife', name: 'Wife', slug: 'wife', Icon: User },
  { id: 'mother', name: 'Mother', slug: 'mother', Icon: User },
  { id: 'female-friend', name: 'Female Friend', slug: 'female-friend', Icon: User },
  { id: 'girlfriend', name: 'Girlfriend', slug: 'girlfriend', Icon: User },
  { id: 'daughter', name: 'Daughter', slug: 'daughter', Icon: User },
  { id: 'sister', name: 'Sister', slug: 'sister', Icon: User },
  { id: 'grandmother', name: 'Grandmother', slug: 'grandmother', Icon: User },
  { id: 'girl-child', name: 'Girl Child', slug: 'girl-child', Icon: User },
];

// LEGACY CATEGORIES - map to new GiftType for compatibility if needed, or phase out.
// For now, these are the same as GIFT_TYPES_LIST for Product.category mapping.
export const CATEGORIES: Category[] = GIFT_TYPES_LIST.map(gt => ({...gt}));


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
    category: 't-shirt', // Using a GiftType slug
    occasion: ['birthday', 'anniversary', 'valentines-day'],
    recipient: ['women', 'wife', 'girlfriend', 'mother'],
    popularity: 85,
    trending: true,
    giftWrapAvailable: true,
    personalizedMessageAvailable: true,
    customizable: true,
    slug: 'luxury-silk-scarf',
    soldBy: 'Just4UGifts',
    availableColors: ['#FFC0CB', '#ADD8E6', '#90EE90'],
    attributes: [
        { name: 'Material', value: '100% Mulberry Silk' },
        { name: 'Dimensions', value: '90cm x 90cm' },
        { name: 'Care', value: 'Dry clean only' }
    ],
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
    category: 'digital-gifts', // Using a GiftType slug
    occasion: ['birthday', 'farewell'],
    recipient: ['men', 'women', 'male-friend', 'female-friend'],
    popularity: 92,
    trending: true,
    customizable: false,
    slug: 'wireless-headphones',
    soldBy: 'TechWorld',
    availableColors: ['#000000', '#FFFFFF', '#808080'],
    attributes: [
        { name: 'Connectivity', value: 'Bluetooth 5.0' },
        { name: 'Battery Life', value: 'Up to 30 hours' },
        { name: 'Features', value: 'Active Noise Cancellation, Built-in Mic' }
    ],
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
    category: 'custom-mugs', // Using a GiftType slug
    occasion: ['house-warming', 'birthday', 'teachers-day'],
    recipient: ['men', 'women', 'male-friend', 'female-friend'],
    popularity: 78,
    giftWrapAvailable: true,
    customizable: true,
    slug: 'ceramic-mug-set',
    attributes: [
        { name: 'Set Includes', value: '4 Mugs' },
        { name: 'Material', value: 'Stoneware Ceramic' },
        { name: 'Capacity', value: '12 oz each' }
    ],
  },
   {
    id: 'prod_4',
    name: 'Personalized 3D Crystal Heart',
    description: 'Capture a cherished memory in a stunning 3D laser-engraved crystal heart. Comes with an LED light base.',
    price: 89.99,
    imageUrls: ['https://placehold.co/600x800.png', 'https://placehold.co/100x120.png'],
    dataAiHint: '3d crystal heart',
    category: '3d-crystals',
    occasion: ['anniversary', 'valentines-day', 'wedding', 'mothers-day'],
    recipient: ['wife', 'girlfriend', 'mother', 'women'],
    popularity: 95,
    trending: true,
    customizable: true,
    slug: 'personalized-3d-crystal-heart',
    reviews: [{ id: 'rev_4_1', author: 'John B.', rating: 5, comment: 'Absolutely beautiful, my wife loved it!', date: '2023-05-20' }]
  },
  {
    id: 'prod_5',
    name: 'Custom Caricature from Photo',
    description: 'Turn your favorite photo into a fun and unique hand-drawn caricature. Digital and framed options available.',
    price: 59.00,
    imageUrls: ['https://placehold.co/600x800.png', 'https://placehold.co/100x120.png'],
    dataAiHint: 'custom caricature drawing',
    category: 'caricature',
    occasion: ['birthday', 'farewell', 'wedding'],
    recipient: ['men', 'women', 'male-friend', 'female-friend'],
    popularity: 88,
    customizable: true,
    slug: 'custom-caricature-photo',
  },
  {
    id: 'prod_6',
    name: 'Engraved Wooden Photo Frame',
    description: 'A beautifully crafted wooden photo frame, personalized with your message. Holds a 5x7 photo.',
    price: 29.99,
    imageUrls: ['https://placehold.co/600x800.png', 'https://placehold.co/100x120.png'],
    dataAiHint: 'engraved wooden frame',
    category: 'photo-frames',
    occasion: ['birthday', 'anniversary', 'house-warming', 'parents-day'],
    recipient: ['men', 'women', 'father', 'mother', 'husband', 'wife', 'grandparents-day'],
    popularity: 90,
    trending: true,
    customizable: true,
    slug: 'engraved-wooden-photo-frame',
  },
  // Add more products, ensuring they map to the new GiftType, Occasion, Recipient slugs
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(product => product.slug === slug);
}

// Updated to filter by GiftType slug
export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter(product => product.category === categorySlug);
}

export function getProductsByOccasion(occasionSlug: string): Product[] {
  return PRODUCTS.filter(product => product.occasion?.includes(occasionSlug));
}

export function getProductsByRecipient(recipientSlug: string): Product[] {
  return PRODUCTS.filter(product => product.recipient?.includes(recipientSlug));
}
