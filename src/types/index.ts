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