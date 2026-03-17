export type ProductCategory = "smartphones" | "accessories" | "clothing";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  stock: number;
  tags: string[];
  badge?: string;
}

export const products: Product[] = [
  // SMARTPHONES
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    category: "smartphones",
    subcategory: "Apple",
    price: 1498500,
    description:
      "The most powerful iPhone ever. Titanium design, A17 Pro chip, 48MP main camera with 5x optical zoom, and Action Button. Supports USB 3 speeds.",
    images: ["/assets/generated/iphone-15-pro.dim_600x600.jpg"],
    rating: 4.9,
    reviewCount: 2841,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    stock: 48,
    tags: ["apple", "flagship", "5g", "titanium"],
    badge: "New",
  },
  {
    id: "samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    category: "smartphones",
    subcategory: "Samsung",
    price: 1948500,
    originalPrice: 1399,
    description:
      "Galaxy AI on the most powerful Galaxy. Built-in S Pen, 200MP camera, 100x Space Zoom, Snapdragon 8 Gen 3.",
    images: ["/assets/generated/samsung-s24-ultra.dim_600x600.jpg"],
    rating: 4.8,
    reviewCount: 1932,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    stock: 31,
    tags: ["samsung", "android", "5g", "s-pen"],
    badge: "Sale",
  },
  {
    id: "pixel-8-pro",
    name: "Google Pixel 8 Pro",
    category: "smartphones",
    subcategory: "Google",
    price: 1198500,
    description:
      "Google's most advanced phone. Tensor G3 chip, 50MP camera with Magic Eraser, 7 years of OS updates.",
    images: ["/assets/generated/pixel-8-pro.dim_600x600.jpg"],
    rating: 4.7,
    reviewCount: 1105,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: false,
    stock: 22,
    tags: ["google", "android", "5g", "ai"],
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    category: "smartphones",
    subcategory: "Apple",
    price: 1048500,
    originalPrice: 799,
    description:
      "Dynamic Island on iPhone 15. 48MP camera, A16 Bionic chip, USB-C connector.",
    images: ["/assets/generated/iphone-15.dim_600x600.jpg"],
    rating: 4.7,
    reviewCount: 3204,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    stock: 67,
    tags: ["apple", "5g", "dynamic-island"],
    badge: "Sale",
  },
  {
    id: "oneplus-12",
    name: "OnePlus 12",
    category: "smartphones",
    subcategory: "OnePlus",
    price: 1048500,
    description:
      "Hasselblad camera system, Snapdragon 8 Gen 3, 100W SUPERVOOC charging. Never Settle.",
    images: ["/assets/generated/oneplus-12.dim_600x600.jpg"],
    rating: 4.6,
    reviewCount: 782,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    stock: 14,
    tags: ["oneplus", "android", "5g"],
  },
  {
    id: "xiaomi-14-pro",
    name: "Xiaomi 14 Pro",
    category: "smartphones",
    subcategory: "Xiaomi",
    price: 973500,
    description:
      "Leica professional optics, Snapdragon 8 Gen 3, 120W HyperCharge. The camera phone redefined.",
    images: ["/assets/generated/xiaomi-14-pro.dim_600x600.jpg"],
    rating: 4.5,
    reviewCount: 543,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    stock: 19,
    tags: ["xiaomi", "leica", "5g"],
  },
  {
    id: "samsung-a55",
    name: "Samsung Galaxy A55",
    category: "smartphones",
    subcategory: "Samsung",
    price: 673500,
    originalPrice: 499,
    description:
      "Sleek design meets exceptional performance. 50MP camera, IP67 water resistance, 5000mAh battery.",
    images: ["/assets/generated/samsung-a55.dim_600x600.jpg"],
    rating: 4.4,
    reviewCount: 1287,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    stock: 55,
    tags: ["samsung", "mid-range", "5g"],
    badge: "Sale",
  },
  // ACCESSORIES
  {
    id: "airpods-pro-2",
    name: "AirPods Pro (2nd Gen)",
    category: "accessories",
    subcategory: "Earbuds",
    price: 298500,
    originalPrice: 249,
    description:
      "Adaptive Audio, Personalized Spatial Audio, MagSafe charging case. Up to 30 hours total listening time.",
    images: ["/assets/generated/airpods-pro-2.dim_600x600.jpg"],
    rating: 4.8,
    reviewCount: 4102,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    stock: 88,
    tags: ["apple", "anc", "wireless"],
    badge: "Sale",
  },
  {
    id: "samsung-buds-2-pro",
    name: "Galaxy Buds2 Pro",
    category: "accessories",
    subcategory: "Earbuds",
    price: 223500,
    description:
      "360 Audio, Active Noise Cancellation, IPX7 waterproof. Hi-Fi 24-bit audio quality.",
    images: ["/assets/generated/samsung-buds-2-pro.dim_600x600.jpg"],
    rating: 4.6,
    reviewCount: 1893,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    stock: 44,
    tags: ["samsung", "anc", "wireless"],
  },
  {
    id: "magsafe-charger",
    name: "MagSafe Wireless Charger 15W",
    category: "accessories",
    subcategory: "Chargers",
    price: 58500,
    description:
      "Perfectly aligned magnets deliver fast 15W wireless charging to your iPhone.",
    images: ["/assets/generated/magsafe-charger.dim_600x600.jpg"],
    rating: 4.7,
    reviewCount: 3210,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    stock: 120,
    tags: ["apple", "wireless", "magsafe"],
    badge: "Popular",
  },
  {
    id: "anker-powerbank",
    name: "Anker 26800mAh Power Bank",
    category: "accessories",
    subcategory: "Power Banks",
    price: 118500,
    originalPrice: 99,
    description:
      "26800mAh capacity, 65W USB-C PD, charges MacBook Pro. Three ports for simultaneous charging.",
    images: ["/assets/generated/anker-powerbank.dim_600x600.jpg"],
    rating: 4.8,
    reviewCount: 5671,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    stock: 73,
    tags: ["anker", "power-bank", "usb-c"],
    badge: "Sale",
  },
  {
    id: "spigen-case",
    name: "Spigen Ultra Hybrid iPhone 15 Pro",
    category: "accessories",
    subcategory: "Cases",
    price: 43500,
    description:
      "Military-grade protection with crystal clarity. Air Cushion Technology, MagSafe compatible.",
    images: ["/assets/generated/spigen-case.dim_600x600.jpg"],
    rating: 4.6,
    reviewCount: 8901,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    stock: 200,
    tags: ["spigen", "case", "magsafe"],
  },
  {
    id: "tempered-glass",
    name: "Premium Tempered Glass Screen Protector",
    category: "accessories",
    subcategory: "Screen Protectors",
    price: 22500,
    description:
      "9H hardness, 99.9% transparency, oleophobic coating. Easy bubble-free installation with alignment kit.",
    images: ["/assets/generated/tempered-glass.dim_600x600.jpg"],
    rating: 4.5,
    reviewCount: 12041,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    stock: 500,
    tags: ["screen-protector", "universal"],
  },
  {
    id: "gan-charger-65w",
    name: "GaN Charger 65W USB-C",
    category: "accessories",
    subcategory: "Chargers",
    price: 73500,
    originalPrice: 69,
    description:
      "GaN technology — 50% smaller than conventional chargers. 65W fast charging for laptops, tablets, and phones.",
    images: ["/assets/generated/gan-charger-65w.dim_600x600.jpg"],
    rating: 4.7,
    reviewCount: 2341,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    stock: 85,
    tags: ["charger", "gan", "usb-c"],
    badge: "Sale",
  },
  {
    id: "soundcore-p3",
    name: "SoundCore Life P3 Earbuds",
    category: "accessories",
    subcategory: "Earbuds",
    price: 82500,
    description:
      "Active Noise Cancellation, 50H total playtime, IPX5 waterproof, 9 EQ presets via app.",
    images: ["/assets/generated/soundcore-p3.dim_600x600.jpg"],
    rating: 4.5,
    reviewCount: 3892,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    stock: 66,
    tags: ["anker", "anc", "budget"],
  },
  // CLOTHING
  {
    id: "oversized-hoodie",
    name: "TechStyle Oversized Hoodie",
    category: "clothing",
    subcategory: "Streetwear",
    price: 133500,
    originalPrice: 120,
    description:
      "Premium 380GSM fleece, dropped shoulders, kangaroo pocket. Heavyweight streetwear staple in jet black.",
    images: ["/assets/generated/oversized-hoodie.dim_600x600.jpg"],
    rating: 4.8,
    reviewCount: 1432,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    stock: 34,
    tags: ["hoodie", "streetwear", "unisex"],
    badge: "Sale",
  },
  {
    id: "cargo-pants-olive",
    name: "Cargo Pants — Olive",
    category: "clothing",
    subcategory: "Men",
    price: 118500,
    description:
      "100% cotton twill, 8 functional pockets, tapered fit. The perfect everyday cargo pant.",
    images: ["/assets/generated/cargo-pants-olive.dim_600x600.jpg"],
    rating: 4.6,
    reviewCount: 892,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    stock: 28,
    tags: ["cargo", "men", "casual"],
  },
  {
    id: "crop-top-white",
    name: "Essential Crop Top — White",
    category: "clothing",
    subcategory: "Women",
    price: 52500,
    description:
      "Ribbed cotton-modal blend, relaxed cropped fit. The versatile wardrobe essential that goes with everything.",
    images: ["/assets/generated/crop-top-white.dim_600x600.jpg"],
    rating: 4.7,
    reviewCount: 2103,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    stock: 92,
    tags: ["crop-top", "women", "casual"],
  },
  {
    id: "bomber-jacket-navy",
    name: "Urban Bomber Jacket — Navy",
    category: "clothing",
    subcategory: "Streetwear",
    price: 217500,
    originalPrice: 180,
    description:
      "MA-1 inspired silhouette, satin lining, ribbed cuffs. The statement outerwear piece for the modern wardrobe.",
    images: ["/assets/generated/bomber-jacket-navy.dim_600x600.jpg"],
    rating: 4.8,
    reviewCount: 741,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    stock: 18,
    tags: ["jacket", "streetwear", "outerwear"],
    badge: "Sale",
  },
  {
    id: "graphic-tee",
    name: "Tech Circuit Graphic Tee",
    category: "clothing",
    subcategory: "Casual Wear",
    price: 67500,
    description:
      "Heavyweight 220GSM cotton, screen-printed circuit-board graphic. Pre-shrunk, fade-resistant print.",
    images: ["/assets/generated/graphic-tee.dim_600x600.jpg"],
    rating: 4.5,
    reviewCount: 1204,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    stock: 56,
    tags: ["tee", "graphic", "unisex"],
  },
  {
    id: "wide-leg-trousers",
    name: "Wide-Leg Trousers — Cream",
    category: "clothing",
    subcategory: "Women",
    price: 142500,
    description:
      "Elevated wide-leg silhouette in luxurious linen-blend fabric. High waist with invisible zipper.",
    images: ["/assets/generated/wide-leg-trousers.dim_600x600.jpg"],
    rating: 4.7,
    reviewCount: 567,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    stock: 24,
    tags: ["trousers", "women", "linen"],
  },
  {
    id: "bucket-hat",
    name: "Reversible Bucket Hat",
    category: "clothing",
    subcategory: "Accessories",
    price: 57000,
    description:
      "Two looks in one. 100% cotton shell with contrast lining. Wide brim UV protection.",
    images: ["/assets/generated/bucket-hat.dim_600x600.jpg"],
    rating: 4.4,
    reviewCount: 893,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    stock: 71,
    tags: ["hat", "unisex", "streetwear"],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
export function getProductsByCategory(cat: ProductCategory): Product[] {
  return products.filter((p) => p.category === cat);
}
export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}
export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNewArrival);
}
export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}
