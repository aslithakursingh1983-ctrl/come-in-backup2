import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { PRODUCTS, Product } from "@/src/data/catalog";

type CartState = Record<string, number>; // productId -> qty

type CartContextValue = {
  items: CartState;
  totalCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  getQty: (productId: string) => number;
  add: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  cartLines: { product: Product; qty: number }[];
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "@comein_cart_v1";
const DELIVERY_FEE_THRESHOLD = 199;
const DELIVERY_FEE = 29;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartState>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {}
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items, hydrated]);

  const getQty = useCallback((id: string) => items[id] ?? 0, [items]);

  const add = useCallback((id: string) => {
    setItems((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  const increment = add;

  const decrement = useCallback((id: string) => {
    setItems((prev) => {
      const next = { ...prev };
      const q = (next[id] ?? 0) - 1;
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const cartLines = useMemo(
    () =>
      Object.entries(items)
        .map(([id, qty]) => {
          const product = PRODUCTS.find((p) => p.id === id);
          return product ? { product, qty } : null;
        })
        .filter(Boolean) as { product: Product; qty: number }[],
    [items],
  );

  const totalCount = useMemo(
    () => Object.values(items).reduce((a, b) => a + b, 0),
    [items],
  );

  const subtotal = useMemo(
    () => cartLines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
    [cartLines],
  );

  const deliveryFee = subtotal === 0 ? 0 : subtotal >= DELIVERY_FEE_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const value: CartContextValue = {
    items,
    totalCount,
    subtotal,
    deliveryFee,
    total,
    getQty,
    add,
    increment,
    decrement,
    remove,
    clear,
    cartLines,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
