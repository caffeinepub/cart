import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appContext";
import { useCart } from "../store/cartStore";

export default function CartPage() {
  const { navigate } = useApp();
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    total,
    itemCount,
    discountCode,
    discountPercent,
    applyDiscount,
  } = useCart();
  const [codeInput, setCodeInput] = useState("");

  const handleApplyDiscount = () => {
    const ok = applyDiscount(codeInput);
    if (ok) toast.success(`Discount applied: ${codeInput.toUpperCase()}`);
    else toast.error("Invalid discount code");
    setCodeInput("");
  };

  if (items.length === 0) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-32 text-center"
        data-ocid="cart.empty_state"
      >
        <ShoppingBag
          size={56}
          className="text-muted-foreground mx-auto mb-5 opacity-40"
        />
        <h2 className="font-display text-2xl font-bold mb-3">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-8">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button
          onClick={() => navigate("home")}
          data-ocid="cart.primary_button"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">
        Shopping Cart ({itemCount})
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4" data-ocid="cart.list">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="flex gap-4 bg-card border border-border rounded-2xl p-4"
                data-ocid={`cart.item.${i + 1}`}
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {item.product.subcategory}
                      </p>
                      <h3 className="font-semibold text-sm leading-tight">
                        {item.product.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      data-ocid={`cart.delete_button.${i + 1}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-secondary"
                        data-ocid={"cart.button"}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-secondary"
                        data-ocid={"cart.button"}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("home")}
            className="gap-2"
            data-ocid="cart.secondary_button"
          >
            Continue Shopping
          </Button>
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-2xl p-6 h-fit space-y-4">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <Separator />

          {/* Discount code */}
          <div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Discount code"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyDiscount()}
                  className="pl-8 h-9 text-sm"
                  data-ocid="cart.input"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleApplyDiscount}
                data-ocid="cart.secondary_button"
              >
                Apply
              </Button>
            </div>
            {discountPercent > 0 && (
              <Badge className="mt-2 bg-green-500/10 text-green-500 border-green-500/20">
                {discountCode} – {discountPercent}% off
              </Badge>
            )}
          </div>

          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount ({discountPercent}%)</span>
                <span>−${(subtotal - total).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-green-500">Free</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full h-12 gap-2"
            onClick={() => navigate("checkout")}
            data-ocid="cart.primary_button"
          >
            Checkout <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </main>
  );
}
