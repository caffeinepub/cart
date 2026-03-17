import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  Moon,
  Search,
  Shield,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { products } from "../data/products";
import type { Product } from "../data/products";
import { type Page, useApp } from "../store/appContext";
import { useCart } from "../store/cartStore";
import { useUser } from "../store/userStore";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const { itemCount } = useCart();
  const { isLoggedIn, isAdmin } = useUser();
  const { navigate, page } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const navLinks: { label: string; page: Page }[] = [
    { label: "Phones", page: "smartphones" },
    { label: "Accessories", page: "accessories" },
    { label: "Clothing", page: "clothing" },
  ];

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchResults(
      products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.tags.some((t) => t.includes(q.toLowerCase())),
        )
        .slice(0, 5),
    );
  };

  const isActive = (p: Page) => page === p;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("home")}
            className="flex items-baseline gap-0.5 flex-shrink-0"
            data-ocid="nav.link"
          >
            <span className="font-display text-xl font-bold text-primary">
              Tech
            </span>
            <span className="font-display text-xl font-bold text-foreground">
              Style
            </span>
          </button>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => navigate(link.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.page) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <div className="relative hidden sm:block">
              {searchOpen ? (
                <div className="flex items-center">
                  <div className="relative">
                    <Input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-56 h-8 pr-8 text-sm"
                      data-ocid="nav.search_input"
                    />
                    {searchResults.length > 0 && (
                      <div className="absolute top-full mt-2 left-0 w-72 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50">
                        {searchResults.map((p) => (
                          <button
                            type="button"
                            key={p.id}
                            onClick={() => {
                              navigate("product", { productId: p.id });
                              setSearchOpen(false);
                              setSearchQuery("");
                              setSearchResults([]);
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-secondary text-left"
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {p.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ₦{p.price.toLocaleString()}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSearchOpen(true)}
                  data-ocid="nav.button"
                >
                  <Search size={16} />
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleDarkMode}
              data-ocid="nav.toggle"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </Button>

            <button
              type="button"
              onClick={() => navigate("cart")}
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
              data-ocid="nav.button"
            >
              <ShoppingCart size={18} className="text-foreground" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                  {itemCount > 9 ? "9+" : itemCount}
                </Badge>
              )}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-1">
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => navigate("admin")}
                    title="Admin"
                    data-ocid="nav.button"
                  >
                    <Shield size={16} className="text-primary" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => navigate("account")}
                  data-ocid="nav.button"
                >
                  <User size={16} />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="h-8 text-xs"
                onClick={() => navigate("login")}
                data-ocid="nav.primary_button"
              >
                Sign In
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border/40 py-3"
            >
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.page}
                  onClick={() => {
                    navigate(link.page);
                    setMobileOpen(false);
                  }}
                  className="block w-full text-left px-2 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"
                  data-ocid="nav.link"
                >
                  {link.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
