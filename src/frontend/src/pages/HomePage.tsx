import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  ChevronRight,
  Headphones,
  Shirt,
  Smartphone,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import ProductCard from "../components/ProductCard";
import StarRating from "../components/StarRating";
import {
  getBestSellers,
  getFeaturedProducts,
  getNewArrivals,
} from "../data/products";
import { siteReviews } from "../data/reviews";
import { useApp } from "../store/appContext";

const categories = [
  {
    label: "Smartphones",
    desc: "Latest flagships & best value picks",
    icon: Smartphone,
    page: "smartphones" as const,
    color: "from-blue-500/20 to-purple-500/10",
  },
  {
    label: "Accessories",
    desc: "Chargers, earbuds, cases & more",
    icon: Headphones,
    page: "accessories" as const,
    color: "from-amber-500/20 to-orange-500/10",
  },
  {
    label: "Clothing",
    desc: "Streetwear, casual & fashion-forward",
    icon: Shirt,
    page: "clothing" as const,
    color: "from-pink-500/20 to-rose-500/10",
  },
];

export default function HomePage() {
  const { navigate } = useApp();
  const [email, setEmail] = useState("");
  const featured = getFeaturedProducts().slice(0, 8);
  const newArrivals = getNewArrivals().slice(0, 4);
  const bestSellers = getBestSellers().slice(0, 4);

  const handleNewsletter = () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("You are subscribed! Welcome to TechStyle.");
    setEmail("");
  };

  return (
    <main>
      {/* HERO */}
      <section className="relative hero-bg min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: "oklch(0.76 0.16 80)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl"
            style={{ background: "oklch(0.62 0.18 290)" }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-medium border mb-6"
              style={{
                borderColor: "oklch(0.76 0.16 80 / 0.4)",
                color: "oklch(0.76 0.16 80)",
                background: "oklch(0.76 0.16 80 / 0.08)",
              }}
            >
              New Arrivals for 2025
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Premium Tech
              <span className="block gold-text">&amp; Style</span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
              Discover the latest smartphones, premium accessories, and
              fashion-forward clothing in one elegant store.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => navigate("smartphones")}
                data-ocid="home.primary_button"
              >
                Shop Phones <ArrowRight size={16} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate("clothing")}
                data-ocid="home.secondary_button"
              >
                View Collection
              </Button>
            </div>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
          <div
            className="w-0.5 h-8 bg-white/40 rounded-full"
            style={{ animation: "fadeInUp 2s ease infinite" }}
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        className="max-w-7xl mx-auto px-4 py-20"
        data-ocid="home.section"
      >
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Shop by Category
          </h2>
          <p className="text-muted-foreground">
            Everything you need, all in one place
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              onClick={() => navigate(cat.page)}
              className={`relative cursor-pointer bg-gradient-to-br ${cat.color} border border-border rounded-2xl p-8 group hover:border-primary/40 transition-all duration-300`}
              data-ocid="home.card"
            >
              <div className="w-12 h-12 rounded-xl bg-background/80 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <cat.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-1">
                {cat.label}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{cat.desc}</p>
              <div className="flex items-center gap-1 text-primary text-sm font-medium">
                Shop now{" "}
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 py-4" data-ocid="home.section">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Products
            </h2>
            <p className="text-muted-foreground">
              Hand-picked selections from our best range
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("smartphones")}
            className="hidden sm:flex items-center gap-1.5 text-sm text-primary hover:underline"
            data-ocid="home.link"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section
        className="max-w-7xl mx-auto px-4 py-20"
        data-ocid="home.section"
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              New Arrivals
            </h2>
            <p className="text-muted-foreground">Just landed in our store</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {newArrivals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section
        className="bg-card border-y border-border py-20"
        data-ocid="home.section"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Best Sellers
              </h2>
              <p className="text-muted-foreground">
                Customer favourites this month
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestSellers.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section
        className="max-w-7xl mx-auto px-4 py-20"
        data-ocid="home.section"
      >
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Star size={16} className="fill-primary text-primary" />
            <span className="font-semibold text-foreground">4.9</span>
            <span>from over 15,000 reviews</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {siteReviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <StarRating rating={r.rating} size={14} />
              <h4 className="font-semibold text-sm mt-3 mb-2 text-foreground">
                {r.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {r.body}
              </p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                <img
                  src={r.avatar}
                  alt={r.author}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {r.author}
                  </p>
                  {r.verified && (
                    <p className="text-xs text-primary">Verified Purchase</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section
        className="bg-card border-t border-border"
        data-ocid="home.section"
      >
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">
            Stay in the Loop
          </h2>
          <p className="text-muted-foreground mb-8">
            Get exclusive deals, new arrivals, and style tips straight to your
            inbox.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNewsletter()}
              className="flex-1"
              data-ocid="home.input"
            />
            <Button onClick={handleNewsletter} data-ocid="home.submit_button">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </main>
  );
}
