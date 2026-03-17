import { Button } from "@/components/ui/button";
import { Fingerprint, ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../store/appContext";

interface LoginPageProps {
  onLogin: () => void;
  isLoggingIn: boolean;
}

export default function LoginPage({ onLogin, isLoggingIn }: LoginPageProps) {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-5">
            <Fingerprint className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to your TechStyle account
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-5">
          <Button
            className="w-full h-12 text-base gap-3"
            onClick={onLogin}
            disabled={isLoggingIn}
            data-ocid="login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Continue with Internet Identity
              </>
            )}
          </Button>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: ShieldCheck, label: "Secure" },
              { icon: Zap, label: "Instant" },
              { icon: Fingerprint, label: "Private" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/60"
              >
                <Icon size={18} className="text-primary" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            No password needed. Authenticate with your device biometrics.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("home")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="login.link"
          >
            Continue browsing as guest &rarr;
          </button>
        </div>
      </motion.div>
    </div>
  );
}
