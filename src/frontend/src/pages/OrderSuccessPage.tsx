import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, Package, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../store/appContext";

interface OrderSuccessPageProps {
  orderNumber?: string;
}

export default function OrderSuccessPage({
  orderNumber,
}: OrderSuccessPageProps) {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 size={40} className="text-green-500" />
        </motion.div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Order Confirmed!
        </h1>
        {orderNumber && (
          <p className="text-muted-foreground mb-1">Order #{orderNumber}</p>
        )}
        <p className="text-muted-foreground mb-10">
          Thank you for shopping with TechStyle. You\'ll receive a confirmation
          email shortly.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: Mail, label: "Confirmation\nEmailed" },
            { icon: Package, label: "Order\nProcessing" },
            { icon: Truck, label: "Ships in\n1–2 Days" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl"
            >
              <Icon size={20} className="text-primary" />
              <p className="text-xs text-muted-foreground text-center whitespace-pre-line">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("account")}
            data-ocid="success.secondary_button"
          >
            View Orders
          </Button>
          <Button
            className="flex-1"
            onClick={() => navigate("home")}
            data-ocid="success.primary_button"
          >
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
