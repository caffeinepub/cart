import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Product } from "../data/products";
import { useApp } from "../store/appContext";
import { useCart } from "../store/cartStore";
import { useUser } from "../store/userStore";
import StarRating from "./StarRating";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { savedItems, toggleSavedItem } = useUser();
  const { navigate } = useApp();
  const isSaved = savedItems.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavedItem(product.id);
    toast.success(isSaved ? "Removed from saved items" : "Saved for later");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer"
      style={{ boxShadow: "none", transition: "box-shadow 0.28s ease" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 20px 50px -12px oklch(0.72 0.16 75 / 0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
      onClick={() => navigate("product", { productId: product.id })}
      data-ocid="product.card"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold">
            {product.badge}
          </Badge>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          data-ocid="product.toggle"
        >
          <Heart
            size={15}
            className={
              isSaved ? "fill-primary text-primary" : "text-muted-foreground"
            }
          />
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">
          {product.subcategory}
        </p>
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-2 text-card-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={product.rating} size={12} />
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-foreground">
              ₦{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="h-8 px-3 text-xs gap-1.5"
            onClick={handleAddToCart}
            data-ocid="product.primary_button"
          >
            <ShoppingCart size={13} /> Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
