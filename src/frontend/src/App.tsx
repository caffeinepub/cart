import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import type { ProductCategory } from "./data/products";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import DeliveryTrackingPage from "./pages/DeliveryTrackingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { AppContext, type NavState, type Page } from "./store/appContext";
import { CartProvider } from "./store/cartStore";
import { UserProvider } from "./store/userStore";

function AppInner() {
  const { login, isLoggingIn, isLoginSuccess, identity } =
    useInternetIdentity();
  const { data: isAdminData } = useIsAdmin();
  const isLoggedIn = isLoginSuccess && !!identity;
  const isAdmin = !!isAdminData;

  const [page, setPage] = useState<Page>("home");
  const [navState, setNavState] = useState<NavState>({});
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("ts_dark_mode");
    return stored !== null ? stored === "true" : true;
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("ts_dark_mode", String(darkMode));
  }, [darkMode]);

  const navigate = (target: Page, state: NavState = {}) => {
    if ((target === "account" || target === "admin") && !isLoggedIn) {
      setPage("login");
      setNavState({});
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setPage(target);
    setNavState(state);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (isLoggedIn && page === "login") setPage(isAdmin ? "admin" : "home");
  }, [isLoggedIn, isAdmin, page]);

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage />;
      case "smartphones":
        return <CategoryPage category="smartphones" />;
      case "accessories":
        return <CategoryPage category="accessories" />;
      case "clothing":
        return <CategoryPage category="clothing" />;
      case "product":
        return <ProductDetailPage productId={navState.productId || ""} />;
      case "cart":
        return <CartPage />;
      case "checkout":
        return <CheckoutPage />;
      case "account":
        return isLoggedIn ? (
          <AccountPage />
        ) : (
          <LoginPage onLogin={login} isLoggingIn={isLoggingIn} />
        );
      case "admin":
        return isLoggedIn ? (
          <AdminPage />
        ) : (
          <LoginPage onLogin={login} isLoggingIn={isLoggingIn} />
        );
      case "delivery":
        return <DeliveryTrackingPage />;
      case "login":
        return <LoginPage onLogin={login} isLoggingIn={isLoggingIn} />;
      case "order-success":
        return <OrderSuccessPage orderNumber={navState.orderNumber} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AppContext.Provider
      value={{
        page,
        navState,
        navigate,
        darkMode,
        toggleDarkMode: () => setDarkMode((d) => !d),
      }}
    >
      <UserProvider isLoggedIn={isLoggedIn} isAdmin={isAdmin}>
        <CartProvider>
          <div className="grain-overlay min-h-screen flex flex-col">
            <Header
              darkMode={darkMode}
              toggleDarkMode={() => setDarkMode((d) => !d)}
            />
            <div className="flex-1">{renderPage()}</div>
            <Footer />
          </div>
          <Toaster richColors position="bottom-right" />
        </CartProvider>
      </UserProvider>
    </AppContext.Provider>
  );
}

export default function App() {
  return <AppInner />;
}
