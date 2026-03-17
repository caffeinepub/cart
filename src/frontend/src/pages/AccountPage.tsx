import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Download,
  Eye,
  Heart,
  LogOut,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { products } from "../data/products";
import { useApp } from "../store/appContext";
import { type UserProfile, useUser } from "../store/userStore";

const statusColors: Record<string, string> = {
  processing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  shipped: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function AccountPage() {
  const { navigate } = useApp();
  const {
    profile,
    setProfile,
    orders,
    recentlyViewed,
    savedItems,
    toggleSavedItem,
    setIsLoggedIn,
  } = useUser();
  const [form, setForm] = useState<UserProfile>(profile);
  const [saving, setSaving] = useState(false);

  const savedProducts = products.filter((p) => savedItems.includes(p.id));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setProfile(form);
    setSaving(false);
    toast.success("Profile updated");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("home");
    toast.success("Signed out successfully");
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">My Account</h1>
          {profile.name && (
            <p className="text-muted-foreground mt-1">
              Welcome back, {profile.name}!
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleLogout}
          data-ocid="account.primary_button"
        >
          <LogOut size={15} /> Sign Out
        </Button>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger
            value="profile"
            className="gap-2"
            data-ocid="account.tab"
          >
            <User size={14} /> Profile
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2" data-ocid="account.tab">
            <ShoppingBag size={14} /> Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-2" data-ocid="account.tab">
            <Heart size={14} /> Saved ({savedItems.length})
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="gap-2"
            data-ocid="account.tab"
          >
            <Clock size={14} /> Recent
          </TabsTrigger>
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-2xl"
          >
            <h2 className="font-semibold text-lg mb-6">Profile Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  data-ocid="account.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  data-ocid="account.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  data-ocid="account.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Input
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  placeholder="United States"
                  data-ocid="account.input"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="123 Main St"
                  data-ocid="account.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="New York"
                  data-ocid="account.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>ZIP Code</Label>
                <Input
                  value={form.zipCode}
                  onChange={(e) =>
                    setForm({ ...form, zipCode: e.target.value })
                  }
                  placeholder="10001"
                  data-ocid="account.input"
                />
              </div>
            </div>
            <Separator className="my-6" />
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
              data-ocid="account.save_button"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />{" "}
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </motion.div>
        </TabsContent>

        {/* ORDERS */}
        <TabsContent value="orders">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {orders.length === 0 ? (
              <div
                className="text-center py-20"
                data-ocid="account.empty_state"
              >
                <Package
                  size={48}
                  className="text-muted-foreground mx-auto mb-4 opacity-40"
                />
                <p className="text-muted-foreground">No orders yet.</p>
                <Button className="mt-4" onClick={() => navigate("home")}>
                  Start Shopping
                </Button>
              </div>
            ) : (
              orders.map((order, i) => (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-2xl p-5"
                  data-ocid={`account.item.${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold">#{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                      <span className="font-bold">
                        ₦{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {order.items.slice(0, 3).map((item) => (
                      <img
                        key={item.productId}
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {order.trackingNumber && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1.5 h-8"
                        onClick={() =>
                          navigate("delivery", { orderId: order.id })
                        }
                        data-ocid={"account.secondary_button"}
                      >
                        <Package size={12} /> Track
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs gap-1.5 h-8"
                      data-ocid={"account.button"}
                    >
                      <Download size={12} /> Invoice
                    </Button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </TabsContent>

        {/* SAVED */}
        <TabsContent value="saved">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {savedProducts.length === 0 ? (
              <div
                className="text-center py-20"
                data-ocid="account.empty_state"
              >
                <Heart
                  size={48}
                  className="text-muted-foreground mx-auto mb-4 opacity-40"
                />
                <p className="text-muted-foreground">No saved items yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-card border border-border rounded-2xl overflow-hidden"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-sm font-bold text-primary">
                        ₦{p.price.toLocaleString()}
                      </p>
                      <div className="flex gap-1.5 mt-2">
                        <Button
                          size="sm"
                          className="flex-1 h-7 text-xs"
                          onClick={() =>
                            navigate("product", { productId: p.id })
                          }
                          data-ocid="account.primary_button"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => toggleSavedItem(p.id)}
                          data-ocid="account.delete_button"
                        >
                          <Eye size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </TabsContent>

        {/* RECENTLY VIEWED */}
        <TabsContent value="history">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {recentlyViewed.length === 0 ? (
              <div
                className="text-center py-20"
                data-ocid="account.empty_state"
              >
                <Clock
                  size={48}
                  className="text-muted-foreground mx-auto mb-4 opacity-40"
                />
                <p className="text-muted-foreground">
                  No recently viewed products.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {recentlyViewed.map((item) => (
                  <button
                    type="button"
                    key={item.productId}
                    onClick={() =>
                      navigate("product", { productId: item.productId })
                    }
                    className="bg-card border border-border rounded-2xl overflow-hidden text-left hover:border-primary/40 transition-colors"
                    data-ocid="account.button"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-sm font-bold text-primary">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
