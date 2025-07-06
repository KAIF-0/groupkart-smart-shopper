import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem, User } from '@/types';

type CartStore = {
  carts: Record<string, Cart>;
  currentUser: User | null;
  createCart: (cartData: Omit<Cart, 'id' | 'items' | 'totalSavings' | 'smartSwapsAccepted'>) => string;
  addItemToCart: (cartId: string, item: Omit<CartItem, 'id'>) => void;
  removeItemFromCart: (cartId: string, itemId: string) => void;
  acceptSwap: (cartId: string, itemId: string) => void;
  addUserToCart: (cartId: string, user: User) => void;
  setCurrentUser: (user: User | null) => void;
  getCart: (cartId: string) => Cart | undefined;
  getCategorySpent: (cartId: string, category: string) => number;
  getUserContribution: (cartId: string, userId: string) => number;
  getTotalSavings: (cartId: string) => number;
  checkAllergyConflicts: (cartId: string, ingredients: string[]) => User[];
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      carts: {},
      currentUser: null,

      createCart: (cartData) => {
        const cartId = Math.random().toString(36).substring(2, 15);
        const newCart: Cart = {
          ...cartData,
          id: cartId,
          items: [],
          totalSavings: 0,
          smartSwapsAccepted: 0,
        };
        
        set((state) => ({
          carts: { ...state.carts, [cartId]: newCart }
        }));
        
        return cartId;
      },

      addItemToCart: (cartId, itemData) => {
        const itemId = Math.random().toString(36).substring(2, 15);
        const newItem: CartItem = { ...itemData, id: itemId };
        
        set((state) => {
          const cart = state.carts[cartId];
          if (!cart) return state;
          
          return {
            carts: {
              ...state.carts,
              [cartId]: {
                ...cart,
                items: [...cart.items, newItem]
              }
            }
          };
        });
      },

      removeItemFromCart: (cartId, itemId) => {
        set((state) => {
          const cart = state.carts[cartId];
          if (!cart) return state;
          
          return {
            carts: {
              ...state.carts,
              [cartId]: {
                ...cart,
                items: cart.items.filter(item => item.id !== itemId)
              }
            }
          };
        });
      },

      acceptSwap: (cartId, itemId) => {
        set((state) => {
          const cart = state.carts[cartId];
          if (!cart) return state;
          
          const items = cart.items.map(item => {
            if (item.id === itemId && item.suggestedSwap) {
              const savings = item.price - item.suggestedSwap.price;
              return {
                ...item,
                name: item.suggestedSwap.name,
                price: item.suggestedSwap.price,
                suggestedSwap: undefined
              };
            }
            return item;
          });
          
          return {
            carts: {
              ...state.carts,
              [cartId]: {
                ...cart,
                items,
                smartSwapsAccepted: cart.smartSwapsAccepted + 1,
                totalSavings: cart.totalSavings + (cart.items.find(i => i.id === itemId)?.suggestedSwap ? 
                  (cart.items.find(i => i.id === itemId)!.price - cart.items.find(i => i.id === itemId)!.suggestedSwap!.price) : 0)
              }
            }
          };
        });
      },

      addUserToCart: (cartId, user) => {
        set((state) => {
          const cart = state.carts[cartId];
          if (!cart) return state;
          
          const userExists = cart.users.some(u => u.id === user.id);
          if (userExists) return state;
          
          return {
            carts: {
              ...state.carts,
              [cartId]: {
                ...cart,
                users: [...cart.users, user]
              }
            }
          };
        });
      },

      setCurrentUser: (user) => set({ currentUser: user }),

      getCart: (cartId) => get().carts[cartId],

      getCategorySpent: (cartId, category) => {
        const cart = get().carts[cartId];
        if (!cart) return 0;
        return cart.items
          .filter(item => item.category === category)
          .reduce((sum, item) => sum + item.price, 0);
      },

      getUserContribution: (cartId, userId) => {
        const cart = get().carts[cartId];
        if (!cart) return 0;
        return cart.items
          .filter(item => item.addedBy === userId)
          .reduce((sum, item) => sum + item.price, 0);
      },

      getTotalSavings: (cartId) => {
        const cart = get().carts[cartId];
        return cart?.totalSavings || 0;
      },

      checkAllergyConflicts: (cartId, ingredients) => {
        const cart = get().carts[cartId];
        if (!cart) return [];
        
        return cart.users.filter(user => 
          user.allergies.some(allergy => 
            ingredients.some(ingredient => 
              ingredient.toLowerCase().includes(allergy.toLowerCase())
            )
          )
        );
      }
    }),
    {
      name: 'groupkart-storage',
    }
  )
);