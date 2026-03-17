import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  shippingAddress: string;
  paymentMethod: string;
}

export interface RecentlyViewedItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  viewedAt: string;
}

interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  recentlyViewed: RecentlyViewedItem[];
  addRecentlyViewed: (item: RecentlyViewedItem) => void;
  savedItems: string[];
  toggleSavedItem: (productId: string) => void;
  isAdmin: boolean;
}

const defaultProfile: UserProfile = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "United States",
};

const sampleOrders: Order[] = [
  {
    id: "TS-10021",
    date: "2024-12-05",
    items: [
      {
        productId: "iphone-15-pro",
        name: "iPhone 15 Pro",
        quantity: 1,
        price: 999,
        image: "https://picsum.photos/seed/iphone15pro/80/80",
      },
      {
        productId: "airpods-pro-2",
        name: "AirPods Pro (2nd Gen)",
        quantity: 1,
        price: 199,
        image: "https://picsum.photos/seed/airpodspro2/80/80",
      },
    ],
    subtotal: 1198,
    total: 1198,
    status: "delivered",
    trackingNumber: "UPS1Z999AA10123456784",
    shippingAddress: "123 Main St, New York, NY 10001",
    paymentMethod: "Visa ending 4242",
  },
  {
    id: "TS-10034",
    date: "2024-12-12",
    items: [
      {
        productId: "oversized-hoodie",
        name: "TechStyle Oversized Hoodie",
        quantity: 2,
        price: 89,
        image: "https://picsum.photos/seed/hoodiebk/80/80",
      },
    ],
    subtotal: 178,
    total: 178,
    status: "shipped",
    trackingNumber: "FEDEX123456789",
    shippingAddress: "123 Main St, New York, NY 10001",
    paymentMethod: "Mastercard ending 8888",
  },
];

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
  children,
  isLoggedIn: externalLogin,
  isAdmin,
}: { children: React.ReactNode; isLoggedIn: boolean; isAdmin: boolean }) {
  const [profile, setProfileState] = useState<UserProfile>(() =>
    load("ts_profile", defaultProfile),
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    load("ts_orders", sampleOrders),
  );
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(
    () => load("ts_rv", []),
  );
  const [savedItems, setSavedItems] = useState<string[]>(() =>
    load("ts_saved", []),
  );
  const [isLoggedIn, setIsLoggedIn] = useState(externalLogin);

  useEffect(() => {
    setIsLoggedIn(externalLogin);
  }, [externalLogin]);
  useEffect(() => {
    save("ts_profile", profile);
  }, [profile]);
  useEffect(() => {
    save("ts_orders", orders);
  }, [orders]);
  useEffect(() => {
    save("ts_rv", recentlyViewed);
  }, [recentlyViewed]);
  useEffect(() => {
    save("ts_saved", savedItems);
  }, [savedItems]);

  const setProfile = useCallback((p: UserProfile) => setProfileState(p), []);
  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);
  const addRecentlyViewed = useCallback((item: RecentlyViewedItem) => {
    setRecentlyViewed((prev) =>
      [item, ...prev.filter((i) => i.productId !== item.productId)].slice(
        0,
        12,
      ),
    );
  }, []);
  const toggleSavedItem = useCallback((productId: string) => {
    setSavedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        profile,
        setProfile,
        orders,
        addOrder,
        recentlyViewed,
        addRecentlyViewed,
        savedItems,
        toggleSavedItem,
        isAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
