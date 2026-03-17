import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { type ProductCategory, getProductsByCategory } from "../data/products";
import { useApp } from "../store/appContext";

interface CategoryPageProps {
  category: ProductCategory;
}

const categoryMeta: Record<
  ProductCategory,
  { label: string; desc: string; subcategories: string[] }
> = {
  smartphones: {
    label: "Smartphones",
    desc: "The latest and greatest phones from top brands",
    subcategories: ["All", "Apple", "Samsung", "Google", "OnePlus", "Xiaomi"],
  },
  accessories: {
    label: "Phone Accessories",
    desc: "Chargers, earbuds, cases, power banks, and more",
    subcategories: [
      "All",
      "Earbuds",
      "Chargers",
      "Cases",
      "Power Banks",
      "Screen Protectors",
    ],
  },
  clothing: {
    label: "Clothing",
    desc: "Street-style and everyday fashion for all",
    subcategories: ["All", "Streetwear", "Men", "Women", "Casual Wear"],
  },
};

export default function CategoryPage({ category }: CategoryPageProps) {
  const { navigate } = useApp();
  const meta = categoryMeta[category];
  const allProducts = getProductsByCategory(category);

  const [subcategory, setSubcategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 2250000]);

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      const inSub = subcategory === "All" || p.subcategory === subcategory;
      const inPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return inSub && inPrice;
    });
    if (sortBy === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating")
      list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "reviews")
      list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    else
      list = [...list].sort(
        (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0),
      );
    return list;
  }, [allProducts, subcategory, sortBy, priceRange]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <button
          type="button"
          onClick={() => navigate("home")}
          className="hover:text-foreground transition-colors"
          data-ocid="category.link"
        >
          Home
        </button>
        <ChevronRight size={14} />
        <span className="text-foreground">{meta.label}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          {meta.label}
        </h1>
        <p className="text-muted-foreground">{meta.desc}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={16} className="text-muted-foreground" />
          {meta.subcategories.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSubcategory(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                subcategory === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
              data-ocid="category.tab"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
              className="w-44 h-8 text-xs"
              data-ocid="category.select"
            >
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="reviews">Most Reviewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price range */}
      <div className="mb-8 flex items-center gap-4">
        <span className="text-xs text-muted-foreground w-24">
          Price: ₦{priceRange[0].toLocaleString()} – ₦
          {priceRange[1].toLocaleString()}
        </span>
        <Slider
          min={0}
          max={2250000}
          step={10000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="w-48"
        />
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground mb-6">
        {filtered.length} products
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24" data-ocid="category.empty_state">
          <p className="text-muted-foreground text-lg mb-4">
            No products match your filters.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSubcategory("All");
              setPriceRange([0, 2250000]);
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
