import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Product } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  discountPercent: number;
  applyDiscount: (code: string) => boolean;
  subtotal: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

const DISCOUNT_CODES: Record<string, number> = {
  TECHSTYLE10: 10,
  WELCOME20: 20,
  SAVE15: 15,
};

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem("techstyle_cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem("techstyle_cart", JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing)
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0)
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    else
      setItems((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
      );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const applyDiscount = useCallback((code: string): boolean => {
    const pct = DISCOUNT_CODES[code.toUpperCase()];
    if (pct) {
      setDiscountPercent(pct);
      setDiscountCode(code.toUpperCase());
      return true;
    }
    return false;
  }, []);

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );
  const total = discountPercent
    ? subtotal * (1 - discountPercent / 100)
    : subtotal;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        discountCode,
        setDiscountCode,
        discountPercent,
        applyDiscount,
        subtotal,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
