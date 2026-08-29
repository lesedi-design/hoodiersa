/* HoodieRSA cart layer: keeps the Haunted Editorial storefront fast while checkout data stays explicit and auditable. */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type CartItem, type Size, getPrice } from "@shared/catalog";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "hoodiersa-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as CartItem[]; } catch { return []; }
  });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(items)), [items]);
  const value = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + getPrice(item.productSlug, item.size) * item.quantity, 0);
    return {
      items, itemCount, subtotal,
      addItem: (item: Omit<CartItem, "id">) => setItems((current) => {
        const id = `${item.productSlug}-${item.colorway}-${item.size}`;
        const existing = current.find((entry) => entry.id === id);
        return existing ? current.map((entry) => entry.id === id ? { ...entry, quantity: entry.quantity + item.quantity } : entry) : [...current, { ...item, id }];
      }),
      updateQuantity: (id: string, quantity: number) => setItems((current) => quantity > 0 ? current.map((entry) => entry.id === id ? { ...entry, quantity } : entry) : current.filter((entry) => entry.id !== id)),
      removeItem: (id: string) => setItems((current) => current.filter((entry) => entry.id !== id)),
      clear: () => setItems([]),
    };
  }, [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used within CartProvider"); return context; }
export function getCartProduct(slug: string) { return PRODUCTS.find((product) => product.slug === slug); }
export type { Size };
