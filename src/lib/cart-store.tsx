// Minimal cart store backed by localStorage + React context.
// Persists across reloads; broadcasts across tabs via the `storage` event.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  hydrated: boolean;
}

const KEY = "iraya.cart.v1";
const Ctx = createContext<CartCtx | null>(null);

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read());
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setItems(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const add: CartCtx["add"] = useCallback(
    (item, qty = 1) => {
      const next = [...read()];
      const i = next.findIndex((x) => x.productId === item.productId);
      if (i >= 0) next[i] = { ...next[i], quantity: next[i].quantity + qty };
      else next.push({ ...item, quantity: qty });
      persist(next);
    },
    [persist],
  );

  const remove: CartCtx["remove"] = useCallback(
    (productId) => persist(read().filter((x) => x.productId !== productId)),
    [persist],
  );

  const setQty: CartCtx["setQty"] = useCallback(
    (productId, qty) => {
      const next = read()
        .map((x) => (x.productId === productId ? { ...x, quantity: Math.max(1, qty) } : x))
        .filter((x) => x.quantity > 0);
      persist(next);
    },
    [persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    return { items, count, subtotal, add, remove, setQty, clear, hydrated };
  }, [items, add, remove, setQty, clear, hydrated]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
