import { createContext, useContext } from "react";
import type { ProductCategory } from "../data/products";

export type Page =
  | "home"
  | "smartphones"
  | "accessories"
  | "clothing"
  | "product"
  | "cart"
  | "checkout"
  | "account"
  | "admin"
  | "delivery"
  | "login"
  | "order-success";

export interface NavState {
  productId?: string;
  orderId?: string;
  category?: ProductCategory;
  orderNumber?: string;
}

export interface AppContextType {
  page: Page;
  navState: NavState;
  navigate: (page: Page, state?: NavState) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppContext.Provider");
  return ctx;
}
