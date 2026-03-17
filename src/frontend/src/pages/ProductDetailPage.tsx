import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import StarRating from "../components/StarRating";
import { getProductById } from "../data/products";
import { productReviews } from "../data/reviews";
import { useApp } from "../store/appContext";
import { useCart } from "../store/cartStore";
import { useUser } from "../store/userStore";

interface ProductDetailPageProps {
  productId: string;
}

export default function ProductDetailPage({
  productId,
}: ProductDetailPageProps) {
  const { navigate } = useApp();
  const { addToCart } = useCart();
  const { savedItems, toggleSavedItem, addRecentlyViewed } = useUser();
  const product = getProductById(productId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const reviews = productReviews[productId] || [];
  const isSaved = product ? savedItems.includes(product.id) : false;

  useEffect(() => {
    if (product) {
      addRecentlyViewed({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        viewedAt: new Date().toISOString(),
      });
    }
  }, [product, addRecentlyViewed]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground text-lg">Product not found.</p>
        <Button className="mt-4" onClick={() => navigate("home")}>
          Back to Home
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("checkout");
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <button
          type="button"
          onClick={() => navigate("home")}
          className="hover:text-foreground"
          data-ocid="product.link"
        >
          Home
        </button>
        <ChevronRight size={14} />
        <button
          type="button"
          onClick={() => navigate(product.category)}
          className="hover:text-foreground capitalize"
          data-ocid="product.link"
        >
          {product.category}
        </button>
        <ChevronRight size={14} />
        <span className="text-foreground truncate max-w-40">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image gallery */}
        <div>
          <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden mb-3">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage(
                      (prev) =>
                        (prev - 1 + product.images.length) %
                        product.images.length,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-background"
                  data-ocid="product.button"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage(
                      (prev) => (prev + 1) % product.images.length,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-background"
                  data-ocid="product.button"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  type="button"
                  key={img}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {product.subcategory}
              </p>
              <h1 className="font-display text-3xl font-bold text-foreground">
                {product.name}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => toggleSavedItem(product.id)}
              className="p-2 rounded-full hover:bg-secondary"
              data-ocid="product.toggle"
            >
              <Heart
                size={20}
                className={
                  isSaved
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }
              />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} showValue />
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount.toLocaleString()} reviews)
            </span>
            {product.badge && (
              <Badge className="bg-primary/10 text-primary border-primary/20">
                {product.badge}
              </Badge>
            )}
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-foreground">
              ₦{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  ₦{product.originalPrice.toLocaleString()}
                </span>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  Save {discount}%
                </Badge>
              </>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {product.description}
          </p>

          <Separator className="mb-6" />

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-secondary text-foreground"
                data-ocid="product.button"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="w-10 h-10 flex items-center justify-center hover:bg-secondary text-foreground"
                data-ocid="product.button"
              >
                +
              </button>
            </div>
            <span className="text-xs text-muted-foreground">
              {product.stock} in stock
            </span>
          </div>

          <div className="flex gap-3 mb-8">
            <Button
              className="flex-1 h-12 gap-2"
              onClick={handleAddToCart}
              data-ocid="product.primary_button"
            >
              <ShoppingCart size={18} /> Add to Cart
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 gap-2"
              onClick={handleBuyNow}
              data-ocid="product.secondary_button"
            >
              <Zap size={18} /> Buy Now
            </Button>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, text: "Free Shipping" },
              { icon: Shield, text: "2 Year Warranty" },
              { icon: RotateCcw, text: "30-Day Returns" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 text-center"
              >
                <Icon size={18} className="text-primary" />
                <span className="text-xs text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-6">
            Customer Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <StarRating rating={r.rating} size={14} />
                <h4 className="font-semibold text-sm mt-2 mb-1">{r.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {r.body}
                </p>
                <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-border">
                  <img
                    src={r.avatar}
                    alt={r.author}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold">{r.author}</p>
                    {r.verified && (
                      <p className="text-xs text-primary">Verified</p>
                    )}
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {r.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
