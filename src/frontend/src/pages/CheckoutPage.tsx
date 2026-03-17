import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Check, CreditCard, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appContext";
import { useCart } from "../store/cartStore";
import { useUser } from "../store/userStore";
import type { Order } from "../store/userStore";

type Step = 1 | 2 | 3;

const steps = ["Details", "Payment", "Review"];

export default function CheckoutPage() {
  const { navigate } = useApp();
  const { items, subtotal, total, discountPercent, clearCart } = useCart();
  const { addOrder, profile } = useUser();
  const [step, setStep] = useState<Step>(1);
  const [payMethod, setPayMethod] = useState("card");
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    zipCode: profile.zipCode,
    country: profile.country || "United States",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const [placing, setPlacing] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.address || !form.city) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const orderNumber = `TS-${Math.floor(10000 + Math.random() * 90000)}`;
    const order: Order = {
      id: orderNumber,
      date: new Date().toISOString().split("T")[0],
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.images[0],
      })),
      subtotal,
      total,
      status: "processing",
      trackingNumber: `TRK${Math.floor(100000000 + Math.random() * 900000000)}`,
      shippingAddress: `${form.address}, ${form.city}, ${form.state} ${form.zipCode}`,
      paymentMethod:
        payMethod === "card"
          ? `Visa ending ${form.cardNumber.slice(-4) || "****"}`
          : "PayPal",
    };
    addOrder(order);
    clearCart();
    setPlacing(false);
    navigate("order-success", { orderNumber });
  };

  if (items.length === 0 && step < 3) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Button onClick={() => navigate("home")}>Back to Shop</Button>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress */}
      <div className="flex items-center gap-0 mb-10">
        {steps.map((label, i) => {
          const s = (i + 1) as Step;
          const active = step === s;
          const done = step > s;
          return (
            <div key={label} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  done
                    ? "bg-primary/10 text-primary"
                    : active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {done ? (
                  <Check size={14} />
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center rounded-full border text-xs">
                    {s}
                  </span>
                )}
                {label}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-1 ${step > s ? "bg-primary" : "bg-border"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* Step 1: Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <h2 className="font-semibold text-lg">Customer Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="John Doe"
                      data-ocid="checkout.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="john@example.com"
                      data-ocid="checkout.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+1 234 567 8900"
                      data-ocid="checkout.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                      placeholder="United States"
                      data-ocid="checkout.input"
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                      placeholder="123 Main Street"
                      data-ocid="checkout.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="New York"
                      data-ocid="checkout.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={form.zipCode}
                      onChange={(e) => update("zipCode", e.target.value)}
                      placeholder="10001"
                      data-ocid="checkout.input"
                    />
                  </div>
                </div>
                <Button
                  className="w-full h-12"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  data-ocid="checkout.primary_button"
                >
                  Continue to Payment
                </Button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <h2 className="font-semibold text-lg">Payment Method</h2>
                <RadioGroup
                  value={payMethod}
                  onValueChange={setPayMethod}
                  className="space-y-3"
                  data-ocid="checkout.radio"
                >
                  {[
                    { value: "card", label: "Credit / Debit Card" },
                    { value: "paypal", label: "PayPal" },
                  ].map((opt) => (
                    <div
                      key={opt.value}
                      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${payMethod === opt.value ? "border-primary bg-primary/5" : "border-border"}`}
                    >
                      <RadioGroupItem value={opt.value} id={opt.value} />
                      <Label
                        htmlFor={opt.value}
                        className="cursor-pointer font-medium"
                      >
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {payMethod === "card" && (
                  <div className="space-y-4 p-4 bg-secondary/40 rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ShieldCheck size={14} className="text-primary" />
                      <span>Secured with 256-bit SSL encryption</span>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Card Number</Label>
                      <div className="relative">
                        <CreditCard
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          className="pl-8"
                          placeholder="4242 4242 4242 4242"
                          value={form.cardNumber}
                          onChange={(e) => update("cardNumber", e.target.value)}
                          data-ocid="checkout.input"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Expiry</Label>
                        <Input
                          placeholder="MM / YY"
                          value={form.cardExpiry}
                          onChange={(e) => update("cardExpiry", e.target.value)}
                          data-ocid="checkout.input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>CVC</Label>
                        <Input
                          placeholder="123"
                          value={form.cardCvc}
                          onChange={(e) => update("cardCvc", e.target.value)}
                          data-ocid="checkout.input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={() => setStep(1)}
                    data-ocid="checkout.secondary_button"
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 h-12"
                    onClick={() => setStep(3)}
                    data-ocid="checkout.primary_button"
                  >
                    Review Order
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <h2 className="font-semibold text-lg">Review Your Order</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-sm">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ship to:</span>
                    <span>
                      {form.address}, {form.city}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment:</span>
                    <span className="capitalize">
                      {payMethod === "card" ? "Credit Card" : "PayPal"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={() => setStep(2)}
                    data-ocid="checkout.secondary_button"
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 h-12 gap-2"
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    data-ocid="checkout.submit_button"
                  >
                    {placing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />{" "}
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} /> Place Order – $
                        {total.toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary sidebar */}
        <div className="bg-card border border-border rounded-2xl p-5 h-fit space-y-3">
          <h3 className="font-semibold">Summary</h3>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Items ({items.length})
              </span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount</span>
                <span>−${(subtotal - total).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-green-500">Free</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
