export type User = {
  id: string;
  name: string;
  allergies: string[];
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  ingredients: string[];
  addedBy: string; // userId
  suggestedSwap?: {
    name: string;
    price: number;
    reason: string;
  };
};

export type Cart = {
  id: string;
  name: string;
  users: User[];
  categoryBudgets: Record<string, number>;
  items: CartItem[];
  totalSavings: number;
  smartSwapsAccepted: number;
};

export type CategoryBudget = {
  category: string;
  budget: number;
  spent: number;
};

export const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree Nuts',
  'Milk/Dairy',
  'Eggs',
  'Soy',
  'Wheat/Gluten',
  'Fish',
  'Shellfish',
  'Sesame'
];

export const PRODUCT_CATEGORIES = [
  'Snacks',
  'Beverages',
  'Dairy',
  'Meat & Seafood',
  'Fruits & Vegetables',
  'Bakery',
  'Frozen Foods',
  'Household',
  'Personal Care'
];

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  ingredients: string[];
  brand: string;
  rating: number;
  reviews: number;
};

export const MOCK_PRODUCTS: Product[] = [
  // Snacks
  {
    id: '1',
    name: 'Organic Mixed Nuts',
    price: 299,
    category: 'Snacks',
    description: 'Premium quality mixed nuts with almonds, cashews, and walnuts',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400',
    ingredients: ['almonds', 'cashews', 'walnuts', 'sea salt'],
    brand: 'Nature Valley',
    rating: 4.5,
    reviews: 156
  },
  {
    id: '2',
    name: 'Chocolate Chip Cookies',
    price: 125,
    category: 'Snacks',
    description: 'Crispy cookies loaded with chocolate chips',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
    ingredients: ['wheat flour', 'chocolate chips', 'butter', 'eggs', 'sugar'],
    brand: 'Britannia',
    rating: 4.2,
    reviews: 89
  },
  {
    id: '3',
    name: 'Masala Peanuts',
    price: 85,
    category: 'Snacks',
    description: 'Spicy roasted peanuts with Indian masala',
    image: 'https://images.unsplash.com/photo-1608481337062-4093bf3ed404?w=400',
    ingredients: ['peanuts', 'spices', 'salt', 'oil'],
    brand: 'Haldirams',
    rating: 4.3,
    reviews: 203
  },
  // Beverages
  {
    id: '4',
    name: 'Fresh Orange Juice',
    price: 60,
    category: 'Beverages',
    description: 'Freshly squeezed orange juice, no preservatives',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400',
    ingredients: ['orange juice', 'vitamin C'],
    brand: 'Tropicana',
    rating: 4.6,
    reviews: 342
  },
  {
    id: '5',
    name: 'Green Tea',
    price: 180,
    category: 'Beverages',
    description: 'Premium green tea leaves for health and wellness',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    ingredients: ['green tea leaves', 'natural antioxidants'],
    brand: 'Twinings',
    rating: 4.4,
    reviews: 127
  },
  // Dairy
  {
    id: '6',
    name: 'Organic Milk',
    price: 65,
    category: 'Dairy',
    description: 'Fresh organic milk from grass-fed cows',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    ingredients: ['organic milk', 'vitamin D'],
    brand: 'Amul',
    rating: 4.7,
    reviews: 458
  },
  {
    id: '7',
    name: 'Greek Yogurt',
    price: 95,
    category: 'Dairy',
    description: 'Thick and creamy Greek yogurt with probiotics',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    ingredients: ['milk', 'live cultures', 'cream'],
    brand: 'Danone',
    rating: 4.5,
    reviews: 234
  }
];