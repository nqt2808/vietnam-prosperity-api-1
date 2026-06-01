import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string; // product_id
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stockQuantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          // Check stock
          if (newQuantity > item.stockQuantity) {
            alert(`Rất tiếc, sản phẩm này chỉ còn ${item.stockQuantity} sản phẩm trong kho.`);
            return;
          }
          
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: newQuantity } : i
            ),
          });
        } else {
          if (quantity > item.stockQuantity) {
            alert(`Rất tiếc, sản phẩm này chỉ còn ${item.stockQuantity} sản phẩm trong kho.`);
            return;
          }
          set({ items: [...currentItems, { ...item, quantity }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;

        if (quantity > item.stockQuantity) {
          alert(`Rất tiếc, sản phẩm này chỉ còn ${item.stockQuantity} sản phẩm trong kho.`);
          return;
        }

        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'vpc-cart-storage', // name of the item in the storage (must be unique)
    }
  )
)
