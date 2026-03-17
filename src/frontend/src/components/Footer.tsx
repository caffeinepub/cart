import { Separator } from "@/components/ui/separator";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";
import { useApp } from "../store/appContext";

export default function Footer() {
  const { navigate } = useApp();
  const year = new Date().getFullYear();
  const host = typeof window !== "undefined" ? window.location.hostname : "";

  const categories = [
    { label: "Smartphones", page: "smartphones" as const },
    { label: "Accessories", page: "accessories" as const },
    { label: "Clothing", page: "clothing" as const },
  ];

  const company = [
    { label: "About Us" },
    { label: "Careers" },
    { label: "Press" },
    { label: "Contact" },
  ];

  const support = [
    { label: "Help Center", action: undefined as (() => void) | undefined },
    { label: "Track Order", action: () => navigate("delivery") },
    {
      label: "Returns & Refunds",
      action: undefined as (() => void) | undefined,
    },
    { label: "Shipping Info", action: undefined as (() => void) | undefined },
  ];

  const socials = [
    { Icon: SiInstagram, label: "Instagram", href: "https://instagram.com" },
    { Icon: SiX, label: "X", href: "https://x.com" },
    { Icon: SiFacebook, label: "Facebook", href: "https://facebook.com" },
    { Icon: SiYoutube, label: "YouTube", href: "https://youtube.com" },
  ];

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-display text-2xl font-bold text-primary">
                Tech
              </span>
              <span className="font-display text-2xl font-bold text-foreground">
                Style
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Premium tech and fashion for the modern lifestyle. Quality
              products, fast delivery, and exceptional service.
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Shop</h4>
            <ul className="space-y-2.5">
              {categories.map((c) => (
                <li key={c.label}>
                  <button
                    type="button"
                    onClick={() => navigate(c.page)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-ocid="footer.link"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">
              Company
            </h4>
            <ul className="space-y-2.5">
              {company.map((c) => (
                <li key={c.label}>
                  <span className="text-sm text-muted-foreground">
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">
              Support
            </h4>
            <ul className="space-y-2.5">
              {support.map((s) => (
                <li key={s.label}>
                  {s.action ? (
                    <button
                      type="button"
                      onClick={s.action}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {s.label}
                    </button>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {s.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {year} TechStyle. All rights reserved.</p>
          <p>
            Built with{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(host)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
