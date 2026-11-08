# TASK-003: Build Customer-Facing User Storefront

> **Status**: `BACKLOG`  
> **Assignee**: `friday`, `jarvis`  
> **Priority**: `P0`  
> **Dependencies**: `TASK-002`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As a shopper in Bangladesh visiting the Raye Striped-Shirt store (`development/frontend/`), I want to browse small-batch striped shirts, use the interactive Size Finder to compute my fit, view product details with model lookbook photos, add items to my shopping bag, apply discount codes (`RAYE10`, `SALTAIR`), and checkout with COD, bKash, Nagad, or Card, receiving an order ID (`RY-XXXXX`) that immediately reflects on the Admin Kanban board.

---

## 2. Inputs & Context Documents
- **Design Tokens**: `development/frontend/src/index.css`
- **Catalog & Seed Data**: `development/frontend/src/data/catalog.ts`
- **API Contracts**: [docs/08-api-contract.md](../../docs/08-api-contract.md)
- **Client Requirements**: [README.md](../../README.md) (Section 1 & 2)

---

## 3. Step-by-Step Execution Plan
1. **Storefront Navigation & Shell**:
   - Create `src/pages/ShopPage.tsx` (User Storefront) and navigation toggle in TopNav (`Switch to Live Shop` ↔ `Switch to Admin Dashboard`).
   - Storefront header with brand monogram, navigation links (Shop, Size Finder, Drop 03, Order Tracking), and Bag counter badge.
2. **Hero & Campaign Banner**:
   - Raye brand campaign banner with limited-batch Drop 03 · Rust Bengal live countdown timer.
3. **Product Catalog & Filters**:
   - Filter chips: All shirts, Short sleeve, Long sleeve, Oversized, color families.
   - 12 product cards with flatlay photos, price in ৳ BDT, rating badge, stock pill, and quick size picker.
4. **Interactive Size Finder Widget**:
   - Shopper height (148-198 cm) and weight (40-110 kg) sliders computing exact chest ease formula (`0.3*h + 0.55*w + 5`, `+14 cm` ease) with recommended size badge (XS–XXL).
5. **Product Detail Modal / Drawer**:
   - Lookbook photography, fabric description, size availability grid, and "Add to Bag" action.
6. **Shopping Bag & Cart Drawer**:
   - Line items list with quantity steppers and size indicators.
   - Promo code field (`RAYE10` for 10% off, `SALTAIR` for free delivery).
   - District delivery selector (Dhaka ৳80, Outside Dhaka ৳150, Free over ৳3,000).
7. **Complete Checkout Modal & Order Placement**:
   - Customer details form (name, email, phone, district, delivery address).
   - Payment method selection: Cash on Delivery (COD), bKash, Nagad, Card.
   - Order submission creating order `RY-XXXXX` and adding to local / backend state.
8. **Customer Order Tracking View**:
   - Enter `RY-XXXXX` to view real-time progress tracker (New → Packing → Shipped → Delivered).

---

## 4. Expected Outputs
- `src/pages/ShopPage.tsx` and storefront components in `src/components/shop/`.
- Cart and checkout store in `src/store/shopStore.ts`.
- Seamless switching between Storefront and Admin views.

---

## 5. Acceptance Criteria
- [ ] Shopper can browse all 12 striped shirts with category/family filters.
- [ ] Size Finder calculates fit correctly and filters catalog to recommended size.
- [ ] Shopper can add shirts with selected size to bag, apply coupon codes, and checkout.
- [ ] Placed orders immediately appear on the Admin Overview and Orders Kanban board.
- [ ] Responsive across mobile (≤720px) and desktop.

---

## 6. Verification Evidence (Thanos)
- **Command**: `npm run test` or browser testing script
- **Status**: `Pending`
