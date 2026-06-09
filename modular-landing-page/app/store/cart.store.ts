import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';

export interface TCartItem {
  product: Product;
  quantity: number;
  variant?: {
    id: number;
    name: string;
    price: number;
  };
}

interface CartState {
  items: TCartItem[];

  // Actions
  addItem: (product: Product, quantity?: number, variant?: TCartItem['variant']) => void;
  removeItem: (productId: number, variantId?: number) => void;
  updateQuantity: (productId: number, quantity: number, variantId?: number) => void;
  clearCart: () => void;

  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (productId: number, variantId?: number) => number;
  isInCart: (productId: number, variantId?: number) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      /**
       * Add an item to the cart
       * If the item already exists, increment its quantity
       */
      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.variant?.id === variant?.id
          );

          if (existingItemIndex > -1) {
            // Item exists, update quantity
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          } else {
            // New item, add to cart
            return {
              items: [...state.items, { product, quantity, variant }],
            };
          }
        });
      },

      /**
       * Remove an item from the cart
       */
      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.variant?.id === variantId
              )
          ),
        }));
      },

      /**
       * Update the quantity of an item in the cart
       * If quantity is 0 or negative, remove the item
       */
      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => {
          const newItems = state.items.map((item) => {
            if (
              item.product.id === productId &&
              item.variant?.id === variantId
            ) {
              return { ...item, quantity };
            }
            return item;
          });
          return { items: newItems };
        });
      },

      /**
       * Clear all items from the cart
       */
      clearCart: () => {
        set({ items: [] });
      },

      /**
       * Get the total number of items in the cart
       */
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      /**
       * Get the total price of all items in the cart
       */
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.variant?.price ?? (item.product.on_sale ? item.product.sale_price : item.product.selling_price);
          return total + price * item.quantity;
        }, 0);
      },

      /**
       * Get the quantity of a specific item in the cart
       */
      getItemCount: (productId, variantId) => {
        const item = get().items.find(
          (item) =>
            item.product.id === productId &&
            item.variant?.id === variantId
        );
        return item?.quantity ?? 0;
      },

      /**
       * Check if an item is in the cart
       */
      isInCart: (productId, variantId) => {
        return get().items.some(
          (item) =>
            item.product.id === productId &&
            item.variant?.id === variantId
        );
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);

/**
 * Hook to get cart items
 */
export function useCartItems(): TCartItem[] {
  return useCartStore((state) => state.items);
}

/**
 * Hook to get cart total
 */
export function useCartTotal(): { items: number; price: number } {
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  return {
    items: getTotalItems(),
    price: getTotalPrice(),
  };
}

/**
 * Hook to check if a product is in cart
 */
export function useIsInCart(productId: number, variantId?: number): boolean {
  return useCartStore((state) => state.isInCart(productId, variantId));
}
