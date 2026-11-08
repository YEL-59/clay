# 🛡️ Avengerse: Client Requirements & Project Brief

> 🚀 **Quick Navigation & Usage Guides**:
> - 📖 **Developer Guide / How to Use (English)**: [HOW_TO_USE_EN.md](HOW_TO_USE_EN.md)
> - 🇧🇩 **ব্যবহার নির্দেশিকা (বাংলা গাইড)**: [HOW_TO_USE_BN.md](HOW_TO_USE_BN.md)
> - 📚 **ফোল্ডার ও ফাইল পরিচিতি (A to Z Guide)**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
> - 🤖 **Global Agent Rules**: [AGENTS.md](AGENTS.md)
> - ⚙️ **Project Tech Stack Config**: [project.config.md](project.config.md)
> - 📄 **Full Product Requirements Document**: [PRD.md](PRD.md)
>
> ⚡ **সেশন কন্টিনিউয়েশন প্রম্পট (Next Session Command)**:
> নতুন চ্যাট উইন্ডো খুলে শুধু এই এক লাইন বলুন:
> ```text
> planning/updateplanning.md পড়ে পরবর্তী টাস্ক শুরু করো।
> ```
>
> **Avengerse Protocol — Source of Truth**:
> 1. This document (`README.md`) is the **Single Source of Truth** for client requirements.
> 2. Fill out the sections below to describe the client's project. The Chief Orchestrator (`iron_man`) will read this file to coordinate Jarvis, Friday, Edith, Thor, Thanos, and Ultron.
> 3. **Zero-Assumption Policy**: AI agents must never invent client requirements. Unanswered details must be preserved under **Section 8 (Open Questions)** and tracked in `planning/open-questions.md`.

---

## 1. Project Information

- **Project Name**: **Shifatdevs Admin & Commerce Suite (Raye Striped-Shirt Back Office)**
- **Project Description**: A full-stack MERN (MongoDB, Express.js, React, Node.js) e-commerce storefront and back-office administration suite for **Shifatdevs**, a direct-to-consumer (D2C) apparel brand specializing in small-batch, yarn-dyed linen-cotton striped shirts in Bangladesh (`৳` BDT). The platform unifies real-time sales telemetry, a drag-and-drop Kanban fulfillment board (`New` → `Packing` → `Shipped` → `Delivered` + `Returns` auto-restock), per-size (`XS`–`XXL`) matrix inventory and dynamic pricing, a 3-tier customer CRM (`VIP`, `Regular`, `New`), anthropometric Size Finder analytics (height/weight scatter plot, size demand vs. shelf stock comparison, and return-rate attribution), promotional code & limited-edition drop countdown engines (**Drop 03 · Rust Bengal**), and an offline-capable media & asset management repository with structured ZIP/JPG downloads.
- **Business Domain**: E-Commerce, Apparel & Fashion Retail, D2C Back-Office SaaS, Inventory & Fulfillment Operations
- **Client / Company Information**: **Shifatdevs (Raye Apparel Studio)** — Direct-to-Consumer Menswear & Unisex Striped-Shirt Brand, Dhaka, Bangladesh (operating across all major Bangladeshi districts including Dhaka, Chattogram, Sylhet, Gazipur, Narayanganj, Khulna, Rajshahi, Cox's Bazar, Cumilla, and Mymensingh).
- **Target Audience**:
  - **Primary (Admin Dashboard)**: Store founders, fulfillment & warehouse packers, inventory planners, merchandising managers, and customer support operators (e.g., store manager account `Rumana Akter`).
  - **Secondary (Storefront API Consumers)**: Retail shoppers across Bangladesh purchasing striped shirts via Cash on Delivery (COD), bKash, Nagad, or Card and using the interactive Size Finder.
- **Business Objectives**:
  - **Objective 1**: Streamline order fulfillment from `New` to `Delivered` via a zero-latency drag-and-drop Kanban board and automatically restock returned line items back into size-level inventory.
  - **Objective 2**: Eliminate stockouts and overstocking by aligning per-size (`XS`–`XXL`) shelf inventory against real-time Size Finder demand share and configurable low-stock alerts (default threshold: `≤ 3` units per size).
  - **Objective 3**: Reduce size-related garment returns by >50% (proven `4.7%` return rate with the Size Finder vs. `11.8%` without) through algorithmic height/weight chest-and-length fit recommendations.
  - **Objective 4**: Drive urgency and repeat purchases through limited-batch drop countdowns (`Drop 03 · Rust Bengal`, 60-unit batch), rotating announcement banners, and instant discount codes (`RAYE10` 10% off, `SALTAIR` free delivery).
  - **Objective 5**: Provide organized, offline-capable digital asset management (`products/flatlays`, `products/lookbook`, `editorial/mood`, `editorial/journal`, `team/avatars`) with single-click JPG and structured ZIP archive exports.

---

## 2. Functional Requirements

> Each requirement has an identifiable ID (`REQ-F-001` through `REQ-F-011`) derived directly from the reference application (`https://ecommerce-admin001.vercel.app/`).

- **REQ-F-001 (Authentication, Session & Admin Profile)**:
  - Support JWT-based authentication (HTTP-only access/refresh cookies) for store administrators (e.g., default lead admin profile `Rumana Akter`).
  - Provide quick account menu actions: switch to live shop storefront, navigate to Store Settings, and trigger a full Demo/Seed Data Reset (`POST /api/v1/admin/reset-seed`) that restores baseline stock, prices, orders, notes, and promos while preserving the active UI theme.

- **REQ-F-002 (Role-Based Access Control - RBAC)**:
  - Support distinct operational roles across the MERN backend:
    - `SuperAdmin / Owner`: Full access to store settings, payment gateway toggles, pricing edits, promo deletion, and database seed resets.
    - `FulfillmentManager`: Access to Overview, Orders Kanban board, status transitions, returns restocking, and order notes.
    - `CatalogManager`: Access to Products stock steppers, price adjustments, Promotions, and Asset Library management.

- **REQ-F-003 (Core Shop Overview Dashboard — `#/overview`)**:
  - **Top KPI Stat Strip**: Animated tabular-numeral counters for:
    1. *Current Month Sales* (`৳` BDT formatted in `en-IN` locale, e.g., `৳5,95,890`) with month-over-month percentage badge (`+7% vs September`).
    2. *Orders to Pack* (count of orders in `new` + `packing` states).
    3. *Average Order Value* (calculated across all non-returned orders).
  - **Interactive Sales Chart (`6M` / `12M` Segmented Toggle)**: Smooth monotone cubic-spline SVG area chart plotting monthly revenue (`Nov`–`Oct`) against a dashed horizontal *Monthly Target* line (`৳6.5L` / `৳6,50,000`), complete with pointer/keyboard crosshair inspection, tooltip readout, and summary header (`৳X in 12 months · N of 12 months at target`).
  - **To Pack Queue Widget**: Displays up to 4 priority orders (`2 New`, `2 Packing`) with relative/Dhaka timestamps, customer name, shirt count, district, itemized shirt+size pills (`Lido Stripe M ×2`), total BDT, and overlapping product thumbnails.
  - **Active Limited Drop Card (`Drop 03 · Rust Bengal`)**: Teal-toned feature card with animated SVG radial progress ring (`% sold through`), `Sold (X of 60)`, `Left (stock count)`, and live countdown (`Xd Xh Xm`).
  - **Sales by Cut Breakdown**: Proportional horizontal flex bar and itemized table showing revenue and percentage share across `Short sleeve` (`54%`), `Long sleeve` (`28%`), and `Oversized` (`18%`).
  - **Best Sellers (Last 3 Weeks)**: Ranked top-5 list with product thumbnail, relative horizontal meter bar, units sold, and compact revenue (`৳X.XK` / `৳X.XXL`).
  - **Running Low Stock Alerts**: Lists up to 5 shirts having sizes at or below `settings.lowStock` (or sold out at `0`), displaying mini size badges (`XS`–`XXL` highlighted for low/out) and a 1-click **`Restock`** button (`+10` units across every size).

- **REQ-F-004 (Orders Fulfillment Kanban Board & List View — `#/orders`)**:
  - **Header Metrics**: `To pack and send` (`new` + `packing`), `On the road` (`shipped`), and `Returned` (`returned`).
  - **Toolbar Controls**: Live search by Order ID (`RY-XXXXX`) or Customer Name; payment method filter chips (`All`, `Cash on delivery`, `bKash`, `Nagad`, `Card`); segmented view toggle (`Board` | `List`); and 1-click CSV export.
  - **Pointer Drag-and-Drop Kanban Board**:
    - 4 primary columns (`New` [sky], `Packing` [coral], `Shipped` [teal], `Delivered` [navy]) showing column order count and compact BDT sum (`৳X.XL`), plus a 5th dashed **`Returns`** drop slot.
    - Custom pointer-events drag engine with rotated floating ghost card (`rotation: -2.5deg, scale: 1.03`), column highlight on hover, and bounce animation on drop.
    - Dropping an order into **`Returns`** (or selecting *Return and restock* from the card menu) transitions status to `returned` and **automatically increments product stock** for every line item (`slug` + `size` + `qty`).
  - **Sortable List View (`#/orders?view=list`)**: Responsive stacked data table with sortable `Placed` timestamp and `Total` columns, customer avatar + district, shirt count, payment label, and status pill.
  - **Order Detail Slide-Over Drawer (`#/orders/:id`)**:
    - 4-step animated progress tracker (`New` → `Packing` → `Shipped` → `Delivered`) or `Returned` banner.
    - Customer profile card linking to `#/customers/:id` (name, email, phone, district).
    - Line items with thumbnail, shirt name, size, quantity × unit price, and line total.
    - Financial summary (`Subtotal`, `Code RAYE10 / SALTAIR` discount, `Delivery` fee or `Free`, `Total`, `Payment` method).
    - Persistent **Order Notes** feed with instant note creation (`Gift wrap, call before delivery…`) and footer primary workflow CTA (`Start packing` → `Mark shipped` → `Mark delivered` + `Return`).

- **REQ-F-005 (Catalog, Size-Matrix Inventory & Pricing Management — `#/products`)**:
  - **Header Metrics**: `Shirts on the shelf` (total units across all 12 products × 6 sizes), `Stock value at full price` (`৳` compact), and `Sizes low or sold out` (total size cells `≤ lowStock` or `= 0`).
  - **Catalog Filter & Search**: Search by shirt name or color family (`Coral`, `Teal`, `Blue`, `Earth`, `Yellow`, `Mono`, `Green`); category filter chips (`All shirts`, `Short sleeve`, `Long sleeve`, `Oversized`, `Running low`).
  - **12-Product Card Grid**: Each card displays 4:5 product flatlay image, optional badge (`Popular`, `New`, `Sale`, `Limited`), quick-download photo button, title, current BDT price, category + family, total units left, a 6-column size matrix (`XS`, `S`, `M`, `L`, `XL`, `XXL`) color-coded for normal, low (`is-low`), and sold-out (`is-out` struck through), and warning footer (`X sizes sold out · Y running low`).
  - **Product Detail Slide-Over Drawer (`#/products/:slug`)**:
    - Model lookbook hero photo alongside `In stock`, `Sold, 3 weeks`, and `Rating (e.g., 4.6 · 214)`.
    - **Live Price Editor**: Numeric BDT input (auto-rounded to nearest `৳10`, minimum `৳100`) with `Was ৳X before the sale` reference.
    - **Stock by Size Steppers**: Individual `-` / `+` steppers for `XS` through `XXL` with GSAP bounce feedback, plus a bulk **`+10 in every size`** button.
    - **Direct Asset Downloads**: Footer buttons to download high-res Flatlay JPG and Model Lookbook JPG.

- **REQ-F-006 (Customer CRM & Tier Segmentation — `#/customers`)**:
  - **Header Metrics**: Total `Customers`, `Came back for another` (repeat buyer percentage), and `VIPs, over ৳16,000 spent`.
  - **Automatic Tier Calculation**:
    - `VIP`: Cumulative non-returned spend `> ৳16,000`
    - `Regular`: Cumulative non-returned spend `> ৳6,000` and `≤ ৳16,000`
    - `New`: Cumulative spend `≤ ৳6,000`
  - **Search, Filter & Sortable Table**: Filter by tier (`Everyone`, `VIP`, `Regular`, `New`), search by name/email/district, and sort by `Orders`, `Spent`, or `Last order`.
  - **Customer Profile Drawer (`#/customers/:id`)**: Large avatar, tier badge, `mailto:` and `tel:` links, `Orders` / `Spent` / `Usual size` (mode of purchased sizes) summary, **Favourite shirt** card (most-purchased shirt slug), complete chronological order history linking to `#/orders/:id`, and persistent **Customer Notes** (`Prefers bKash, sizes down in oversized…`).

- **REQ-F-007 (Size Finder Telemetry & Fit Insights — `#/fit`)**:
  - **Header Metrics**: `Size finder uses, 12 weeks`, `Added to bag after` (`%`), and `Returns with the finder (4.7%) vs without (11.8%)`.
  - **Interactive Anthropometric Scatter Plot (`Who uses the finder`)**:
    - Plots 420 shopper sessions by `Height (148–198 cm)` on X-axis and `Weight (40–110 kg)` on Y-axis, color-coded by recommended size (`XS` sky, `S` sea, `M` teal, `L` coral, `XL` navy, `XXL` sand).
    - **Live Size Estimator Controls**: Interactive range sliders for Height (`cm`) and Weight (`kg`) executing the exact garment chest & body-length formula (`chest = 0.3*h + 0.55*w + 5`, `+14 cm` ease allowance against `SIZE_TABLE`), moving the live `YOU` marker on the scatter plot and displaying the recommended size and shopper share.
  - **Weekly Finder Use Chart**: 12-week (`W1`–`W12`) spline area chart with 12-week growth percentage.
  - **Sizes It Recommends Bar Chart**: Animated vertical bar chart of recommendation share across `XS`–`XXL` highlighting the peak size.
  - **Demand Against the Shelf**: Dual horizontal comparison meters per size (`Recommended %` vs. `On the shelf %`) with automated merchandising callout (`"L is X% of what the finder recommends but Y% of the shelf. Reorder L first."`).
  - **Returns Attribution Card (Last 90 Days)**: Compares return rate with finder (`4.7%`) vs. without (`11.8%`), plus horizontal breakdown of return reasons (`Too big 41%`, `Too small 29%`, `Colour not as pictured 14%`, `Changed my mind 11%`, `Arrived damaged 5%`).

- **REQ-F-008 (Promotions, Discount Codes & Drop Countdown — `#/promos`)**:
  - **Header Metrics**: `Codes the shop accepts` (active count) and `Times used this year` (sum of redemptions).
  - **Discount Code Cards**: Colored cards (`coral`, `teal`, `sky`, `navy`) for built-in codes (`RAYE10` — 10% off, `SALTAIR` — Free delivery) and custom admin-created codes, displaying usage count, 1-click clipboard copy, edit modal, delete action (for custom codes), and live enable/disable toggle switch.
  - **Create / Edit Code Modal (`#/promos?new=1`)**: Validates code format (`^[A-Z0-9]{3,16}$`, uppercase alphanumeric, no spaces, duplicate check), discount type segmented control (`% off` [1%–80%] vs. `Free delivery`).
  - **Drop 03 · Rust Bengal Live Clock**: 1-second precision digital countdown (`days`, `hrs`, `min`, `sec` until `2026-11-21T18:00:00+06:00`), batch sell-through progress bar (`Sold X of 60`), and per-size remaining stock pills.
  - **Rotating Top Bar Messages**: Ordered list of storefront announcement bar messages.

- **REQ-F-009 (Organized Asset Management & Offline Viewing Hub — `#/assets`)**:
  - **Structured 5-Folder Repository**: Organizes all 34 high-resolution store images into:
    1. `products/flatlays` (Studio packshots & folded shirts)
    2. `products/lookbook` (On-model fit photography)
    3. `editorial/mood` (Hero campaign, drape, weekend, studio, dockside, texture)
    4. `editorial/journal` (Workshop loom, atelier team, monsoon heat, yarn-dyed weave, 5-shirt rotation)
    5. `team/avatars` (Team & customer portraits)
  - **Offline Viewing Engine**: Uses Browser `CacheStorage` (`shifatdevs-offline-assets-v1`) + Service Worker/fetch fallback to pre-cache all high-resolution assets for 100% offline viewing, showing real-time cached file count and byte size (`MB`).
  - **Single & Bulk Export**: 1-click individual `.jpg` download with structured naming (`shifatdevs-products-flatlays-shirt-sunday.jpg`) and client/server `.zip` archive generation containing the exact folder tree plus `asset-manifest.json`.

- **REQ-F-010 (Global Command Palette Search & Notifications)**:
  - **Global Finder (`⌘K`, `Ctrl+K`, or `/`)**: Modal search indexing all Pages, Shirts (by name, family, category), Customers (by name, district, email), Orders (`RY-XXXXX`), and Media Assets with keyboard arrow navigation (`↑`/`↓`/`Enter`).
  - **In-App Notifications Menu**: Top-bar bell popover with unread coral dot badge, deep-linking to low-stock products, return requests, and promo milestones, plus `Mark all as read`.

- **REQ-F-011 (Store Settings, Delivery Rules & Appearance — `#/settings`)**:
  - **Store Details Form**: Editable `Store name`, `Email` (validated), and `Phone` for receipts and customer emails.
  - **Stock & Delivery Configuration**: Low-stock threshold stepper (`1`–`10` units, default `3`), delivery fee schedule (`Inside Dhaka ৳80`, `Outside Dhaka ৳150`, `Express Dhaka ৳250`, `Free delivery over ৳3,000`).
  - **Checkout Payment Toggles**: Switches for `Cash on delivery`, `bKash`, `Nagad`, and `Card` with guard preventing disabling the last remaining active payment method (`"Checkout needs at least one way to pay"`).
  - **Notification Preferences**: Toggles for `Every new order`, `A size running low`, and `Return requests`.
  - **Circular View-Transition Theme Switcher**: Switches between `Light` (`#e4ecea` seafoam-mist canvas) and `Dark` (`#0b1517` deep-abyssal teal canvas) using the View Transitions API circular clip-path reveal originating from the clicked button coordinates.

---

## 3. Non-Functional Requirements

- **Performance**:
  - P95 REST API response time `< 150ms` for dashboard aggregations, order status transitions, and stock stepper mutations.
  - 60fps animations using compositor-friendly properties (`transform`, `opacity`, SVG `clipPath`) powered by GSAP with automatic `prefers-reduced-motion: reduce` compliance.
  - Zero-flash initial theme rendering via synchronous inline `<head>` script reading persisted theme state prior to first paint.
- **Scalability**:
  - Stateless Express.js + Node.js API tier horizontally scalable via Docker containers behind Nginx.
  - MongoDB compound indexes on `orders(status, placedAt)`, `orders(customerId)`, `customers(email, tier)`, and `products(slug)` to support `100,000+` historical orders and `50,000+` fit sessions without collection scans.
- **Security**:
  - JWT authentication with HTTP-only, `SameSite=Lax`, `Secure` cookies and role-based route middleware.
  - Input validation via `Zod` schemas on all Express API endpoints (`POST /orders`, `PATCH /products/:slug/stock`, `POST /promos`, `PATCH /settings`).
  - Helmet.js security headers, CORS allowlist, and rate limiting (`express-rate-limit`) on auth and mutation endpoints.
- **Accessibility**:
  - WCAG 2.2 AA compliance: semantic `<dialog>` modals and drawers with backdrop click and `Escape` handling, `aria-pressed` filter chips and segmented controls, `aria-live="polite"` toast notifications and stock steppers, keyboard-navigable SVG charts (`ArrowLeft` / `ArrowRight` crosshair), and `Skip to content` link focusing `.head__title`.
- **Availability & Offline Capability**:
  - 99.9% API uptime target; full client-side offline resilience for product imagery via `CacheStorage` (`shifatdevs-offline-assets-v1`) and optimistic UI updates backed by local state synchronization.
- **Maintainability**:
  - Strict TypeScript across both Frontend (`React 19 + Vite`) and Backend (`Node.js + Express + Mongoose/TypeScript`), modular domain separation (`data/`, `store/`, `components/`, `pages/`, `utils/`, `server/`), and deterministic seeded data generation (`seed = 220`) for reproducible E2E testing.
- **Data Retention & Privacy**:
  - Customer PII (phone numbers, emails, delivery addresses) encrypted in transit (TLS 1.3) and at rest in MongoDB Atlas; soft-deletion support for customer records.
- **Auditability**:
  - Every order status change (`new` → `packing` → `shipped` → `delivered` / `returned`), manual stock adjustment, and price update logs an audit entry with timestamp, actor ID, and before/after delta.

---

## 4. Technology Preferences (MERN Stack Architecture)

> Configured for a full-stack **MERN (MongoDB, Express.js, React, Node.js)** deployment with TypeScript end-to-end.

- **Frontend**:
  - **Framework**: React 19 (SPA / Vite 8) with TypeScript
  - **Styling**: Tailwind CSS v4 + Custom CSS Design Tokens (`--bg`, `--glass`, `--rim`, `--coral`, `--teal`, `--navy`, `--sky`, `--sand`, `--sea`) & `color-mix()` glassmorphism
  - **Animation & Motion**: GSAP (`gsap` timelines, number tweening, SVG clipPath reveals, ambient mesh drift) + Native View Transitions API (`document.startViewTransition`)
  - **Client Asset Archiving**: `JSZip` + Browser `CacheStorage` API for offline image viewing and structured `.zip` downloads
- **Backend**:
  - **Runtime & Framework**: Node.js (v22 LTS) + Express.js (`server.ts`) with TypeScript (`tsx`)
  - **Architecture**: RESTful Modular Domain Controllers (`/api/v1/overview`, `/api/v1/orders`, `/api/v1/products`, `/api/v1/customers`, `/api/v1/fit-sessions`, `/api/v1/promos`, `/api/v1/assets`, `/api/v1/settings`)
  - **Validation**: `Zod` request/response schema validation
- **Database**:
  - **Primary Database**: **MongoDB** (v7.0+ / MongoDB Atlas)
  - **Collections**:
    - `products` (slug, name, cat, price, was, rating, reviews, tag, family, colours, stock `{XS..XXL}`, img, model, blurb, details, fabric)
    - `orders` (orderId `RY-XXXXX`, placedAt, customerId, lines `[{slug, size, qty, price}]`, subtotal, discount, shipping, total, delivery, payment, promo, status, notes `[]`, fromShop)
    - `customers` (customerId, name, email, phone, district, since, tier, tone, notes `[]`)
    - `fit_sessions` (heightCm, weightKg, recommendedSize, addedToBag, createdAt)
    - `promos` (code, kind `pct|ship`, value, label, active, uses, custom)
    - `assets` (assetId, filename, title, folder, categoryLabel, src, w, h, assetNumber, productSlug, tags)
    - `settings` (storeId, storeName, email, phone, lowStock, paymentToggles, notificationToggles)
- **ODM / Data Layer**: Mongoose 8 (TypeScript schemas) with automatic fallback to deterministic in-memory/seeded store when `MONGODB_URI` is not provisioned in local/preview environments
- **Cache / Messaging**: Redis (optional for session caching and real-time order webhook pub/sub) + Browser `CacheStorage` for offline media
- **Mobile (Optional)**: Responsive PWA-ready web shell (adapts floating left dock into bottom mobile action bar at `≤ 720px` and converts data tables into stacked mobile cards)
- **Hosting / Infrastructure**: Docker Compose (MongoDB + Express/Node API + Vite/Nginx static & proxy), Cloud Run / Vercel / Linux VPS

---

## 5. Design References

- **Figma URL(s)**: No Figma — built directly from the live reference specification (`https://ecommerce-admin001.vercel.app/`) and its exact CSS token system.
- **Reference Websites / Inspirations**:
  - **Primary Clone Target**: [https://ecommerce-admin001.vercel.app/](https://ecommerce-admin001.vercel.app/) (*Shifatdevs Admin — striped shirts for slow, sunny days*)
- **Brand Colors**:
  - **Light Theme Canvas (`data-theme="light"`)**:
    - Dominant Canvas (`--bg`): `#e4ecea` with drifting ambient radial mesh blobs (`#c8e6de`, `#f7d2c4`, `#cfe1f1`)
    - Glass Surfaces (`--glass` / `--glass-2` / `--float`): `#ffffff7a` / `#ffffffa8` / `#fbfdfc` with `--rim: #fffc` 1px specular border
    - Primary Ink & Pill (`--text` / `--pill`): `#10202b` / `#14293b`
    - Muted Text (`--muted`): `#56676d`
  - **Dark Theme Canvas (`data-theme="dark"`)**:
    - Dominant Canvas (`--bg`): `#0b1517` with ambient mesh blobs (`#0e6e6480`, `#ff7a5933`, `#6ea5d729`)
    - Glass Surfaces (`--glass` / `--float`): `#ffffff0d` / `#1d2b2e`
    - Primary Text (`--text`): `#e7f0ee`
  - **Semantic & Accent Palette**:
    - **Coral (`--coral`)**: `#ff7a59` (Primary brand mark, sales chart area, packing orders, VIP tier, low-stock highlights)
    - **Teal (`--teal` / `--sea`)**: `#0e4f4b` / `#74c2b1` (Drop 03 card, shipped orders, regular tier, best-seller meters, size M)
    - **Sky (`--sky`)**: `#a9d1ec` (New orders, size XS)
    - **Navy (`--navy`)**: `#14293b` (Delivered orders, 90-day returns card, target line, size XL)
    - **Sand (`--sand`)**: `#f1d39a` (Drop 03 ring arc, demand callout banner, size XXL)
    - **Status Good / Bad**: `--good: #1d7657` (dark: `#6fcca4`), `--bad: #c9441f` (dark: `#ff8f72`)
- **Typography Preference**:
  - **Primary UI & Display Font**: **`Urbanist`** (`Google Fonts`, weights `400..700`) with `font-variant-numeric: tabular-nums` enforced globally across all tables, KPIs, prices, and timers.
  - **Brand Monogram Mark**: `Georgia, serif` (`italic 700 20px`) inside a `38×38px` coral rounded square (`R`).
- **Logos & Assets**:
  - 34 curated high-resolution `.jpg` assets stored locally in `/public/raye/photos/220-raye/` and indexed into 5 virtual folders (`products/flatlays`, `products/lookbook`, `editorial/mood`, `editorial/journal`, `team/avatars`), plus `/public/favicon.svg`.
- **Existing Design Systems**: Custom tactile glassmorphic design system (`--r-card: 26px`, `--r-tile: 22px`, pill segmented controls, floating quick dock, custom stroke SVG icon set).

---

## 6. External Integrations

> List third-party services. **NEVER** store API secrets or production credentials in this document.

- **Payment Provider**:
  - **Bangladesh Local Gateways**: **bKash** Merchant Checkout API & **Nagad** Merchant PGW (payment request flow)
  - **Card Processing**: SSLCommerz / Stripe (`Visa, Mastercard, Amex`)
  - **Offline / Logistics Payment**: **Cash on Delivery (COD)** across all 64 districts of Bangladesh
- **Email & SMS Service**: Resend / Postmark (order confirmation & shipping updates) + local BD SMS gateway for OTP/delivery alerts
- **Authentication Provider**: Custom JWT Auth (Access + Refresh tokens via Express.js & MongoDB `users` collection)
- **Object Storage**: Local `/public/raye/photos/220-raye/` static bundle + Cloudflare R2 / AWS S3 bucket mirror with Browser `CacheStorage` offline sync
- **Analytics & Tracking**: Internal Size Finder & Conversion Telemetry Engine (`/api/v1/fit-sessions` & `/api/v1/overview`)
- **Third-Party APIs**: Steadfast / Pathao / RedX Courier Webhook integration (optional for automated `shipped` → `delivered` status sync)

---

## 7. Project Constraints

- **Budget & Infrastructure Limits**: Must run seamlessly in a single container/node environment (Port `3000` unified Express + Vite middleware in development and compiled static + API server in production) as well as standard Docker Compose deployments.
- **Delivery Milestones**:
  - **Milestone 1 (Completed)**: Pixel-accurate frontend dashboard clone with all 7 views, interactive SVG charts, pointer drag-and-drop Kanban board, and local persistence (`raye:admin:v1`).
  - **Milestone 2 (Completed)**: Modular TypeScript folder architecture (`src/types`, `src/data`, `src/store`, `src/components`, `src/pages`, `src/utils`) + 34 local high-res images + Offline Asset Manager (`#/assets`) with `CacheStorage` and `.zip` export.
  - **Milestone 3 (Current)**: Full-stack MERN backend (`server.ts` + MongoDB/Mongoose models + REST API endpoints `/api/v1/*`) connected to the frontend store.
- **Existing Systems / Legacy Data**: Deterministic seed generator (`seed = 220` producing 12 products, 36 customers, 78 historical orders, 420 size-finder sessions, and 12 months of sales telemetry) must be preserved so demo resets and automated tests yield identical baseline figures.
- **Browser Support**: Latest 2 versions of Chrome, Edge, Safari, and Firefox (graceful fallback when `document.startViewTransition` or `CacheStorage` is unavailable).
- **Mobile Platform Requirements**: Full mobile web responsiveness (`≤ 720px` bottom dock navigation, horizontal snap-scrolling Kanban columns, and stacked responsive tables).
- **Compliance Requirements**: Standard Bangladesh E-Commerce (DBID) receipt disclosure and customer data privacy.

---

## 8. Open Questions

> Unanswered questions requiring client confirmation. Iron Man must preserve these and not invent assumptions.

1. **Courier API Auto-Dispatch**: When an admin moves an order card from `Packing` to `Shipped` on the Kanban board, should the MERN backend automatically create a consignment in **Pathao / Steadfast / RedX**, or should courier booking remain a manual step?
2. **Live bKash / Nagad Webhook Reconciliation**: Should `bKash` and `Nagad` orders only appear on the `New` board after webhook payment verification, or should unpaid payment-request orders also appear with a `Pending Payment` badge?
3. **Multi-Warehouse vs. Single Atelier Stock**: Is all shirt inventory (`XS`–`XXL`) fulfilled from a single Dhaka studio warehouse, or do you need separate stock pools for Dhaka Express vs. nationwide fulfillment?
4. **Custom Product & Photo Upload in Admin**: In addition to managing stock/prices of the 12 existing shirts and downloading offline asset packs, should admins be able to upload new shirt SKUs and raw lookbook photos directly to S3/R2 from the `#/products` and `#/assets` views?
