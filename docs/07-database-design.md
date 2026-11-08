# 07 — Database Design & Mongoose Schemas

> Owned and maintained by `edith`. Consulted by `iron_man` and `friday`.

---

## 1. Database Specifications
- **Database Engine**: MongoDB (v7.0+ / MongoDB Atlas)
- **ODM**: Mongoose 8 (with strict TypeScript definitions)
- **Fallback In-Memory Engine**: Deterministic seeded in-memory store (`seed = 220`) activating when `MONGODB_URI` is not provided.
- **Naming Conventions**: camelCase fields, lowercase plural collection names (`products`, `orders`, `customers`, `fit_sessions`, `promos`, `settings`).

---

## 2. Core Collections & Schemas

### 2.1 Products Collection (`products`)
```typescript
interface IProduct {
  slug: string; // unique, e.g. "shirt-sunday"
  name: string; // "Sunday Stripe"
  cat: 'short-sleeve' | 'long-sleeve' | 'oversized';
  price: number; // in BDT, e.g. 2890
  was: number; // e.g. 3290
  rating: number; // 4.8
  reviews: number;
  tag?: string; // "Popular" | "New" | "Sale" | "Limited"
  family: string; // "Teal", "Coral", "Blue", etc.
  colours: string[];
  stock: {
    XS: number;
    S: number;
    M: number;
    L: number;
    XL: number;
    XXL: number;
  };
  img: string; // flatlay photo path
  model: string; // lookbook photo path
  blurb: string;
  details: string;
  fabric: string;
}
```

### 2.2 Orders Collection (`orders`)
```typescript
interface IOrderLine {
  slug: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  qty: number;
  price: number;
}

interface IOrder {
  orderId: string; // unique, e.g. "RY-84910"
  placedAt: Date;
  customerId: string; // reference to customer
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  district: string;
  address?: string;
  lines: IOrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment: 'cod' | 'bkash' | 'nagad' | 'card';
  promo?: string;
  status: 'new' | 'packing' | 'shipped' | 'delivered' | 'returned';
  notes: Array<{ id: string; text: string; at: Date; by: string }>;
  fromShop: boolean;
}
```

### 2.3 Customers Collection (`customers`)
```typescript
interface ICustomer {
  customerId: string; // unique
  name: string;
  email: string;
  phone: string;
  district: string;
  since: Date;
  tier: 'VIP' | 'Regular' | 'New';
  spent: number;
  orders: number;
  notes: Array<{ id: string; text: string; at: Date }>;
}
```

### 2.4 Fit Sessions Collection (`fit_sessions`)
```typescript
interface IFitSession {
  heightCm: number;
  weightKg: number;
  recommendedSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  addedToBag: boolean;
  createdAt: Date;
}
```

### 2.5 Promos Collection (`promos`)
```typescript
interface IPromo {
  code: string; // uppercase, unique, e.g. "RAYE10"
  kind: 'pct' | 'ship';
  value: number; // percentage or fixed delivery discount
  label: string;
  active: boolean;
  uses: number;
  custom?: boolean;
}
```

### 2.6 Settings Collection (`settings`)
```typescript
interface ISettings {
  storeId: string;
  storeName: string;
  email: string;
  phone: string;
  lowStock: number; // default: 3
  deliveryDhaka: number; // default: 80
  deliveryOutside: number; // default: 150
  freeDeliveryThreshold: number; // default: 3000
  paymentToggles: {
    cod: boolean;
    bkash: boolean;
    nagad: boolean;
    card: boolean;
  };
  notificationToggles: {
    order: boolean;
    lowStock: boolean;
    returns: boolean;
  };
}
```
