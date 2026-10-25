import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { productById } from '../data/catalog';

export interface CartItem {
  key: string; // productId + option
  productId: string;
  option?: string;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (productId: string, qty: number, option?: string) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const STORAGE_KEY = 'reaallabout.cart';
const Ctx = createContext<CartCtx | null>(null);

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    // 데이터가 바뀌어 없어진 상품은 제외
    return parsed.filter((i) => productById(i.productId));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* 저장 불가 환경에서는 무시 */
    }
  }, [items]);

  const value = useMemo<CartCtx>(() => {
    const subtotal = items.reduce((s, i) => s + (productById(i.productId)?.price ?? 0) * i.qty, 0);
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal,
      add: (productId, qty, option) => {
        const key = option ? `${productId}::${option}` : productId;
        setItems((prev) => {
          const found = prev.find((i) => i.key === key);
          if (found) return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(99, i.qty + qty) } : i));
          return [...prev, { key, productId, option, qty }];
        });
      },
      setQty: (key, qty) =>
        setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i))),
      remove: (key) => setItems((prev) => prev.filter((i) => i.key !== key)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
