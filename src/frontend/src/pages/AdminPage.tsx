import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type Product,
  type ProductCategory,
  products as seedProducts,
} from "../data/products";
import { useApp } from "../store/appContext";
import { useUser } from "../store/userStore";

function getStoredProducts(): Product[] {
  try {
    const v = localStorage.getItem("ts_admin_products");
    return v ? JSON.parse(v) : seedProducts;
  } catch {
    return seedProducts;
  }
}
function storeProducts(p: Product[]) {
  try {
    localStorage.setItem("ts_admin_products", JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

const statusColors: Record<string, string> = {
  processing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  shipped: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  category: "smartphones",
  subcategory: "",
  price: 0,
  description: "",
  images: [],
  rating: 4.5,
  reviewCount: 0,
  isFeatured: false,
  isNewArrival: true,
  isBestSeller: false,
  stock: 10,
  tags: [],
};

export default function AdminPage() {
  const { navigate } = useApp();
  const { orders } = useUser();
  const { isAdmin } = useUser();

  const [adminProducts, setAdminProducts] =
    useState<Product[]>(getStoredProducts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyProduct);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground mb-4">
          You don&apos;t have access to the admin panel.
        </p>
        <Button onClick={() => navigate("home")}>Back to Home</Button>
      </div>
    );
  }

  const saveProducts = (updated: Product[]) => {
    setAdminProducts(updated);
    storeProducts(updated);
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyProduct);
    setDialogOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ ...p });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    if (editProduct) {
      saveProducts(
        adminProducts.map((p) =>
          p.id === editProduct.id ? { ...form, id: editProduct.id } : p,
        ),
      );
      toast.success("Product updated");
    } else {
      const newId = `${form.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
      saveProducts([...adminProducts, { ...form, id: newId }]);
      toast.success("Product added");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    saveProducts(adminProducts.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    toast.success("Product deleted");
  };

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const stats = [
    { label: "Total Products", value: adminProducts.length, icon: Package },
    { label: "Total Orders", value: orders.length, icon: ShoppingBag },
    {
      label: "Revenue",
      value: `₦${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
    },
    { label: "Customers", value: orders.length + 42, icon: Users },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-2xl p-5"
          >
            <s.icon size={20} className="text-primary mb-3" />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products" data-ocid="admin.tab">
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" data-ocid="admin.tab">
            Orders
          </TabsTrigger>
        </TabsList>

        {/* PRODUCTS */}
        <TabsContent value="products">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {adminProducts.length} products
            </p>
            <Button
              size="sm"
              className="gap-2"
              onClick={openAdd}
              data-ocid="admin.primary_button"
            >
              <Plus size={15} /> Add Product
            </Button>
          </div>
          <div
            className="overflow-auto rounded-2xl border border-border"
            data-ocid="admin.table"
          >
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="text-left p-4 text-muted-foreground font-medium">
                    Product
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-medium">
                    Category
                  </th>
                  <th className="text-right p-4 text-muted-foreground font-medium">
                    Price
                  </th>
                  <th className="text-right p-4 text-muted-foreground font-medium">
                    Stock
                  </th>
                  <th className="text-right p-4 text-muted-foreground font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminProducts.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b border-border/50 hover:bg-secondary/20"
                    data-ocid={`admin.row.${i + 1}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            p.images[0] ||
                            "https://picsum.photos/seed/placeholder/40/40"
                          }
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-medium max-w-48 truncate">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 capitalize text-muted-foreground">
                      {p.category}
                    </td>
                    <td className="p-4 text-right font-semibold">
                      ₦{p.price.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={
                          p.stock < 10 ? "text-red-500" : "text-green-500"
                        }
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => openEdit(p)}
                          data-ocid={`admin.edit_button.${i + 1}`}
                        >
                          <Edit size={13} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteConfirm(p.id)}
                          data-ocid={`admin.delete_button.${i + 1}`}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ORDERS */}
        <TabsContent value="orders">
          <div
            className="overflow-auto rounded-2xl border border-border"
            data-ocid="admin.table"
          >
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="text-left p-4 text-muted-foreground font-medium">
                    Order ID
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-medium">
                    Date
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-medium">
                    Items
                  </th>
                  <th className="text-right p-4 text-muted-foreground font-medium">
                    Total
                  </th>
                  <th className="text-left p-4 text-muted-foreground font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr
                    key={o.id}
                    className="border-b border-border/50 hover:bg-secondary/20"
                    data-ocid={`admin.row.${i + 1}`}
                  >
                    <td className="p-4 font-mono text-xs">{o.id}</td>
                    <td className="p-4 text-muted-foreground">{o.date}</td>
                    <td className="p-4 text-muted-foreground">
                      {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="p-4 text-right font-semibold">
                      ₦{o.total.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <Badge className={statusColors[o.status]}>
                        {o.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl" data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle>
              {editProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Product name"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm({ ...form, category: v as ProductCategory })
                }
              >
                <SelectTrigger data-ocid="admin.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smartphones">Smartphones</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Subcategory</Label>
              <Input
                value={form.subcategory}
                onChange={(e) =>
                  setForm({ ...form, subcategory: e.target.value })
                }
                placeholder="e.g. Apple"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Price *</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                placeholder="0"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Stock</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
                placeholder="10"
                data-ocid="admin.input"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                placeholder="Product description"
                data-ocid="admin.textarea"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Image URL</Label>
              <Input
                value={form.images[0] || ""}
                onChange={(e) => setForm({ ...form, images: [e.target.value] })}
                placeholder="https://..."
                data-ocid="admin.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} data-ocid="admin.save_button">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              data-ocid="admin.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
