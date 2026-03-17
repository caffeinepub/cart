export interface Review {
  id: string;
  productId?: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

export const siteReviews: Review[] = [
  {
    id: "r1",
    author: "Marcus T.",
    avatar: "https://picsum.photos/seed/rev1/80/80",
    rating: 5,
    date: "2024-12-10",
    title: "Best online store for tech!",
    body: "I ordered the iPhone 15 Pro and the AirPods Pro bundle. Both arrived in 2 days, perfectly packed. Will definitely be my go-to store.",
    verified: true,
  },
  {
    id: "r2",
    author: "Sophia L.",
    avatar: "https://picsum.photos/seed/rev2/80/80",
    rating: 5,
    date: "2024-11-28",
    title: "Amazing fashion selection",
    body: "The oversized hoodie is incredible quality. 380GSM fleece is no joke — so warm and the fit is perfect. Ordered in XL and it is exactly the oversized look I wanted.",
    verified: true,
  },
  {
    id: "r3",
    author: "James K.",
    avatar: "https://picsum.photos/seed/rev3/80/80",
    rating: 5,
    date: "2024-11-15",
    title: "Super fast shipping, great prices",
    body: "Bought the Samsung S24 Ultra and the Anker power bank. Both were cheaper than other stores and arrived next day. Highly recommend!",
    verified: true,
  },
  {
    id: "r4",
    author: "Aisha M.",
    avatar: "https://picsum.photos/seed/rev4/80/80",
    rating: 4,
    date: "2024-12-01",
    title: "Great products, stylish website",
    body: "The wide-leg trousers are exactly what I needed. The linen blend is comfortable and looks premium. Sizing runs true to size.",
    verified: true,
  },
  {
    id: "r5",
    author: "David R.",
    avatar: "https://picsum.photos/seed/rev5/80/80",
    rating: 5,
    date: "2024-10-30",
    title: "The GaN charger is a game changer",
    body: "Replaced four old bulky chargers with this one 65W GaN charger. Charges my MacBook, iPad, and phone simultaneously. Unbelievable size for 65W.",
    verified: true,
  },
  {
    id: "r6",
    author: "Priya S.",
    avatar: "https://picsum.photos/seed/rev6/80/80",
    rating: 5,
    date: "2024-12-08",
    title: "Bomber jacket exceeded expectations",
    body: "The navy bomber jacket is stunning in person. The satin lining feels luxurious and the fit is perfect. Got so many compliments wearing it!",
    verified: true,
  },
];

export const productReviews: Record<string, Review[]> = {
  "iphone-15-pro": [
    {
      id: "pr1",
      productId: "iphone-15-pro",
      author: "Alex W.",
      avatar: "https://picsum.photos/seed/prev1/80/80",
      rating: 5,
      date: "2024-12-09",
      title: "Titanium is incredible",
      body: "The titanium frame feels premium and the camera is the best on any phone. The 5x zoom is stunning.",
      verified: true,
    },
    {
      id: "pr2",
      productId: "iphone-15-pro",
      author: "Emma D.",
      avatar: "https://picsum.photos/seed/prev2/80/80",
      rating: 5,
      date: "2024-12-05",
      title: "Best iPhone yet",
      body: "Upgraded from iPhone 13 Pro and the difference is massive. The Action Button is incredibly useful.",
      verified: true,
    },
  ],
  "airpods-pro-2": [
    {
      id: "pr3",
      productId: "airpods-pro-2",
      author: "Mike L.",
      avatar: "https://picsum.photos/seed/prev3/80/80",
      rating: 5,
      date: "2024-11-20",
      title: "Best ANC ever",
      body: "These block out the entire world. The Adaptive Audio is genuinely magical.",
      verified: true,
    },
  ],
  "oversized-hoodie": [
    {
      id: "pr4",
      productId: "oversized-hoodie",
      author: "Tyler B.",
      avatar: "https://picsum.photos/seed/prev4/80/80",
      rating: 5,
      date: "2024-12-01",
      title: "Worth every penny",
      body: "This hoodie is absolutely top quality. The GSM weight is legit and the construction is flawless.",
      verified: true,
    },
  ],
};
