import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  childName?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateItemChildName: (itemIndex: number, childName: string | undefined) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          // Намираме съществуващ item с същия id И същото име на дете (ако има)
          const existing = state.items.find(
            (i) => i.id === item.id && i.childName === item.childName
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.childName === item.childName
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => {
          return {
            items: state.items
              .map((item) =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
              )
              .filter((item) => item.quantity > 0),
          };
        }),
      updateItemChildName: (itemIndex, childName) =>
        set((state) => {
          if (itemIndex < 0 || itemIndex >= state.items.length) {
            return state;
          }
          return {
            items: state.items.map((item, index) =>
              index === itemIndex
                ? { ...item, childName: childName?.trim() || undefined }
                : item
            ),
          };
        }),
      clearCart: () =>
        set(() => {
          return { items: [] };
        }),
    }),
    { name: "cart" }
  )
);
