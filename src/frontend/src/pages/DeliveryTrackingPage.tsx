import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Circle,
  Home,
  MapPin,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../store/appContext";
import { useUser } from "../store/userStore";

const trackingSteps = [
  {
    key: "ordered",
    label: "Order Placed",
    desc: "Your order has been received",
    icon: Package,
  },
  {
    key: "processing",
    label: "Processing",
    desc: "We are preparing your items",
    icon: Package,
  },
  {
    key: "shipped",
    label: "Shipped",
    desc: "Your order is on its way",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    desc: "Package delivered successfully",
    icon: Home,
  },
];

const statusToStep: Record<string, number> = {
  processing: 1,
  shipped: 2,
  delivered: 3,
};

export default function DeliveryTrackingPage() {
  const { navigate, navState } = useApp();
  const { orders } = useUser();

  const order = navState.orderId
    ? orders.find((o) => o.id === navState.orderId)
    : orders.find((o) => o.status === "shipped" || o.status === "processing") ||
      orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground mb-4">No active orders to track.</p>
        <Button onClick={() => navigate("home")}>Start Shopping</Button>
      </div>
    );
  }

  const currentStep = statusToStep[order.status] ?? 0;

  const estimatedDays: Record<string, string> = {
    processing: "2-3 business days",
    shipped: "1-2 business days",
    delivered: "Delivered",
    cancelled: "N/A",
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Track Order</h1>
        <Badge
          className={
            order.status === "delivered"
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
          }
        >
          {order.status}
        </Badge>
      </div>

      {/* Order summary card */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-8">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-muted-foreground">Order ID</span>
          <span className="font-semibold">{order.id}</span>
        </div>
        {order.trackingNumber && (
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted-foreground">Tracking #</span>
            <span className="font-mono text-xs">{order.trackingNumber}</span>
          </div>
        )}
        <div className="flex justify-between text-sm mb-3">
          <span className="text-muted-foreground">Estimated Arrival</span>
          <span className="font-semibold text-primary">
            {estimatedDays[order.status]}
          </span>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Ship to</span>
          <span className="text-right max-w-48">{order.shippingAddress}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mb-8">
        {trackingSteps.map((step, i) => {
          const done = i <= currentStep;
          const active = i === currentStep;
          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex gap-4 mb-6 last:mb-0"
            >
              {/* Line + dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  } ${active ? "ring-4 ring-primary/20" : ""}`}
                >
                  {done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                </div>
                {i < trackingSteps.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 mt-1 min-h-6 ${done ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-semibold text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.label}
                  </p>
                  {active && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Courier card */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-8">
        <h3 className="font-semibold mb-4">Courier Information</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Truck size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">FedEx Express</p>
            <p className="text-xs text-muted-foreground">
              Priority Overnight Delivery
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <MapPin size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">In transit</span>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              Support: 1-800-TECH-STYLE
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate("account")}
          data-ocid="delivery.secondary_button"
        >
          My Orders
        </Button>
        <Button
          className="flex-1"
          onClick={() => navigate("home")}
          data-ocid="delivery.primary_button"
        >
          Continue Shopping
        </Button>
      </div>
    </main>
  );
}
