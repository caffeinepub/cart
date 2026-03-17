import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Check,
  CheckCheck,
  Copy,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appContext";
import { useCart } from "../store/cartStore";
import { useUser } from "../store/userStore";
import type { Order } from "../store/userStore";

type Step = 1 | 2 | 3;

const steps = ["Details", "Payment", "Review"];

const NGN_BANK_ACCOUNTS = [
  {
    bank: "First Bank of Nigeria",
    accountName: "TechStyle Store Ltd",
    accountNumber: "3012345678",
    sortCode: "011",
  },
  {
    bank: "GTBank (Guaranty Trust Bank)",
    accountName: "TechStyle Store Ltd",
    accountNumber: "0123456789",
    sortCode: "058",
  },
  {
    bank: "Access Bank",
    accountName: "TechStyle Store Ltd",
    accountNumber: "0987654321",
    sortCode: "044",
  },
];

const INTL_BANK_ACCOUNTS = [
  {
    country: "United Kingdom",
    bank: "Barclays Bank",
    accountName: "TechStyle Store Ltd",
    accountNumber: "12345678",
    sortCode: "20-12-34",
    iban: "GB29BARC20121234567801",
    swift: "BARCGB22",
  },
  {
    country: "United States",
    bank: "Chase Bank",
    accountName: "TechStyle Store Ltd",
    accountNumber: "000123456789",
    routingNumber: "021000021",
    swift: "CHASUS33",
  },
  {
    country: "European Union",
    bank: "Deutsche Bank",
    accountName: "TechStyle Store Ltd",
    iban: "DE89370400440532013000",
    swift: "DEUTDEDB",
  },
  {
    country: "Ghana",
    bank: "Ecobank Ghana",
    accountName: "TechStyle Store Ltd",
    accountNumber: "1441002345678",
    swift: "ECOCGHAC",
  },
  {
    country: "South Africa",
    bank: "Standard Bank",
    accountName: "TechStyle Store Ltd",
    accountNumber: "00012345678",
    branchCode: "051001",
    swift: "SBZAZAJJ",
  },
  {
    country: "Canada",
    bank: "TD Canada Trust",
    accountName: "TechStyle Store Ltd",
    accountNumber: "1234567890",
    transitNumber: "00152",
    institutionNumber: "004",
    swift: "TDOMCATTTOR",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-2 text-muted-foreground hover:text-primary transition-colors"
      title="Copy"
      data-ocid="checkout.secondary_button"
    >
      {copied ? (
        <CheckCheck size={13} className="text-green-500" />
      ) : (
        <Copy size={13} />
      )}
    </button>
  );
}

function BankDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center">
        <span className="text-xs font-mono font-medium">{value}</span>
        <CopyButton text={value} />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { navigate } = useApp();
  const { items, subtotal, total, discountPercent, clearCart } = useCart();
  const { addOrder, profile } = useUser();
  const [step, setStep] = useState<Step>(1);
  const [payMethod, setPayMethod] = useState("card");
  const [selectedIntlCountry, setSelectedIntlCountry] = useState("");
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    zipCode: profile.zipCode,
    country: profile.country || "Nigeria",
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
    let paymentLabel = "Credit Card";
    if (payMethod === "paypal") paymentLabel = "PayPal";
    if (payMethod === "bank_ngn") paymentLabel = "Bank Transfer (NGN)";
    if (payMethod === "bank_intl")
      paymentLabel = `International Bank Transfer${selectedIntlCountry ? ` – ${selectedIntlCountry}` : ""}`;
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
      paymentMethod: paymentLabel,
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

  const selectedIntlBank = INTL_BANK_ACCOUNTS.find(
    (b) => b.country === selectedIntlCountry,
  );

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
                      placeholder="+234 800 000 0000"
                      data-ocid="checkout.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                      placeholder="Nigeria"
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
                      placeholder="Lagos"
                      data-ocid="checkout.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="zip">ZIP / Postal Code</Label>
                    <Input
                      id="zip"
                      value={form.zipCode}
                      onChange={(e) => update("zipCode", e.target.value)}
                      placeholder="100001"
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
                    {
                      value: "bank_ngn",
                      label: "Bank Transfer (NGN – Nigeria)",
                    },
                    {
                      value: "bank_intl",
                      label: "International Bank Transfer",
                    },
                  ].map((opt) => (
                    <div
                      key={opt.value}
                      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                        payMethod === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} id={opt.value} />
                      <Label
                        htmlFor={opt.value}
                        className="cursor-pointer font-medium flex items-center gap-2"
                      >
                        {(opt.value === "bank_ngn" ||
                          opt.value === "bank_intl") && (
                          <Building2
                            size={15}
                            className="text-muted-foreground"
                          />
                        )}
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Card details */}
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

                {/* NGN Bank Transfer */}
                {payMethod === "bank_ngn" && (
                  <div className="space-y-3 p-4 bg-secondary/40 rounded-xl">
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <Building2 size={15} className="text-primary" />
                      <span>Nigerian Bank Accounts (NGN)</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Transfer the exact amount to any of the accounts below.
                      Use your order number as the payment reference. Your order
                      will be confirmed within 1–2 hours after payment.
                    </p>
                    {NGN_BANK_ACCOUNTS.map((acc) => (
                      <div
                        key={acc.bank}
                        className="p-3 bg-background border border-border rounded-lg"
                      >
                        <p className="text-xs font-semibold text-primary mb-2">
                          {acc.bank}
                        </p>
                        <BankDetailRow
                          label="Account Name"
                          value={acc.accountName}
                        />
                        <BankDetailRow
                          label="Account Number"
                          value={acc.accountNumber}
                        />
                        <BankDetailRow label="Sort Code" value={acc.sortCode} />
                      </div>
                    ))}
                    <div className="flex items-start gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-600 dark:text-amber-400">
                      <ShieldCheck size={13} className="mt-0.5 shrink-0" />
                      <span>
                        Send exactly <strong>₦{total.toLocaleString()}</strong>{" "}
                        and include your name as the transfer narration.
                      </span>
                    </div>
                  </div>
                )}

                {/* International Bank Transfer */}
                {payMethod === "bank_intl" && (
                  <div className="space-y-3 p-4 bg-secondary/40 rounded-xl">
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <Building2 size={15} className="text-primary" />
                      <span>International Bank Transfer</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Select your country to view the local bank details for
                      your region.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {INTL_BANK_ACCOUNTS.map((b) => (
                        <button
                          type="button"
                          key={b.country}
                          onClick={() => setSelectedIntlCountry(b.country)}
                          className={`text-xs px-3 py-2 rounded-lg border transition-colors font-medium ${
                            selectedIntlCountry === b.country
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background hover:border-primary/50"
                          }`}
                          data-ocid="checkout.toggle"
                        >
                          {b.country}
                        </button>
                      ))}
                    </div>

                    {selectedIntlBank && (
                      <div className="p-3 bg-background border border-border rounded-lg">
                        <p className="text-xs font-semibold text-primary mb-2">
                          {selectedIntlBank.bank} – {selectedIntlBank.country}
                        </p>
                        <BankDetailRow
                          label="Account Name"
                          value={selectedIntlBank.accountName}
                        />
                        {selectedIntlBank.accountNumber && (
                          <BankDetailRow
                            label="Account Number"
                            value={selectedIntlBank.accountNumber}
                          />
                        )}
                        {selectedIntlBank.iban && (
                          <BankDetailRow
                            label="IBAN"
                            value={selectedIntlBank.iban}
                          />
                        )}
                        {selectedIntlBank.swift && (
                          <BankDetailRow
                            label="SWIFT / BIC"
                            value={selectedIntlBank.swift}
                          />
                        )}
                        {"sortCode" in selectedIntlBank &&
                          selectedIntlBank.sortCode && (
                            <BankDetailRow
                              label="Sort Code"
                              value={selectedIntlBank.sortCode}
                            />
                          )}
                        {"routingNumber" in selectedIntlBank &&
                          selectedIntlBank.routingNumber && (
                            <BankDetailRow
                              label="Routing Number"
                              value={selectedIntlBank.routingNumber as string}
                            />
                          )}
                        {"branchCode" in selectedIntlBank &&
                          selectedIntlBank.branchCode && (
                            <BankDetailRow
                              label="Branch Code"
                              value={selectedIntlBank.branchCode as string}
                            />
                          )}
                        {"transitNumber" in selectedIntlBank &&
                          selectedIntlBank.transitNumber && (
                            <BankDetailRow
                              label="Transit Number"
                              value={selectedIntlBank.transitNumber as string}
                            />
                          )}
                        {"institutionNumber" in selectedIntlBank &&
                          selectedIntlBank.institutionNumber && (
                            <BankDetailRow
                              label="Institution Number"
                              value={
                                selectedIntlBank.institutionNumber as string
                              }
                            />
                          )}
                      </div>
                    )}

                    {!selectedIntlBank && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        Select your country above to view bank details.
                      </p>
                    )}

                    <div className="flex items-start gap-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-600 dark:text-blue-400">
                      <ShieldCheck size={13} className="mt-0.5 shrink-0" />
                      <span>
                        All amounts are equivalent to{" "}
                        <strong>₦{total.toLocaleString()}</strong>. Use your
                        full name as the payment reference. Orders confirmed
                        within 24 hours.
                      </span>
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
                        ₦{(item.product.price * item.quantity).toLocaleString()}
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
                      {payMethod === "card" && "Credit Card"}
                      {payMethod === "paypal" && "PayPal"}
                      {payMethod === "bank_ngn" && "Bank Transfer (NGN)"}
                      {payMethod === "bank_intl" &&
                        `International Bank Transfer${selectedIntlCountry ? ` – ${selectedIntlCountry}` : ""}`}
                    </span>
                  </div>
                </div>

                {/* Bank transfer confirmation notice */}
                {(payMethod === "bank_ngn" || payMethod === "bank_intl") && (
                  <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-600 dark:text-amber-400">
                    <Building2 size={15} className="mt-0.5 shrink-0" />
                    <span>
                      After placing your order, please complete the bank
                      transfer of <strong>₦{total.toLocaleString()}</strong> to
                      confirm. Your order status will update once payment is
                      received.
                    </span>
                  </div>
                )}

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
                        <ShieldCheck size={16} /> Place Order – ₦
                        {total.toLocaleString()}
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
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount</span>
                <span>−₦{(subtotal - total).toLocaleString()}</span>
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
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
