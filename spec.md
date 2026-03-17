# TechStyle Store

## Current State
Existing project is a blog site (StyleBlog) focused on clothes and phone accessories with a gold/purple design and admin login. This is a full rebuild into a premium e-commerce platform.

## Requested Changes (Diff)

### Add
- Homepage: hero banner, featured products, category grid, new arrivals, best sellers, customer reviews, newsletter signup, footer
- Product listing pages per category: Smartphones, Phone Accessories, Clothing
- Product detail page: image gallery, price, description, ratings/reviews, quantity selector, Add to Cart, Buy Now
- Shopping cart dashboard: item list, quantity controls, remove item, subtotal/total, discount code input, checkout CTA
- Checkout dashboard: customer details form, shipping address, payment method selection, order summary, place order
- User account dashboard: profile (name, email, address), order history, order tracking, saved items, recently viewed
- Admin panel: product CRUD (add/edit/delete), inventory management, customer orders management, sales analytics
- Authentication: sign up, login, logout, password reset flow
- Delivery tracking dashboard: delivery status timeline, estimated arrival, courier info
- Dark mode toggle
- Stripe payment integration
- Authorization (role-based: admin vs customer)

### Modify
- Project name: TechStyle Store
- Full redesign: clean premium Apple-like aesthetic, professional typography, smooth animations

### Remove
- Blog post system
- Gold/purple blog design

## Implementation Plan
1. Select components: authorization, stripe, blob-storage
2. Generate Motoko backend: products, categories, cart, orders, user profiles, reviews, discount codes, delivery tracking, admin operations, sales analytics
3. Build React frontend with all pages: Home, Category listing, Product detail, Cart, Checkout, Account dashboard, Admin dashboard, Auth pages, Delivery tracking
4. Wire authorization for role-based access (admin vs customer)
5. Integrate Stripe checkout
6. Implement dark mode with Tailwind
