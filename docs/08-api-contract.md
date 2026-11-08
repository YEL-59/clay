# 08 — API Contracts (MERN Backend & Frontend Bridge)

> Maintained by `edith`. Consulted by `friday` and `iron_man`.

---

## 1. Global Conventions
- **Base URL**: `/api/v1`
- **Standard Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Error Response Format**:
```json
{
  "success": false,
  "error": "Error message description",
  "statusCode": 400
}
```

---

## 2. Storefront & Catalog Endpoints

### 2.1 List All Products
- **Endpoint**: `GET /api/v1/products`
- **Query Params**: `cat` (`short-sleeve` | `long-sleeve` | `oversized`), `family`, `search`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "slug": "shirt-sunday",
      "name": "Sunday Stripe",
      "cat": "short-sleeve",
      "price": 2890,
      "was": 3290,
      "rating": 4.8,
      "reviews": 182,
      "tag": "Popular",
      "family": "Teal",
      "colours": ["#74c2b1", "#ffffff"],
      "stock": { "XS": 6, "S": 12, "M": 14, "L": 8, "XL": 4, "XXL": 2 },
      "img": "/raye/photos/220-raye/shirt-sunday.jpg",
      "model": "/raye/photos/220-raye/shirt-sunday-model.jpg",
      "blurb": "Crisp yarn-dyed linen-cotton striped shirt.",
      "fabric": "60% French Linen, 40% Organic Cotton"
    }
  ]
}
```

### 2.2 Get Single Product
- **Endpoint**: `GET /api/v1/products/:slug`
- **Success Response (200 OK)**: Product object as above.

### 2.3 Storefront Checkout (Create Order)
- **Endpoint**: `POST /api/v1/orders`
- **Request Body**:
```json
{
  "customer": {
    "name": "Tanvir Ahmed",
    "email": "tanvir@example.com",
    "phone": "01711223344",
    "district": "Dhaka",
    "address": "House 12, Road 4, Dhanmondi"
  },
  "lines": [
    { "slug": "shirt-sunday", "size": "M", "qty": 1, "price": 2890 }
  ],
  "promoCode": "RAYE10",
  "deliveryFee": 80,
  "paymentMethod": "bkash"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "orderId": "RY-48201",
    "placedAt": "2026-11-05T11:20:00.000Z",
    "total": 2681,
    "status": "new",
    "paymentMethod": "bkash"
  }
}
```

### 2.4 Validate Promo Code
- **Endpoint**: `POST /api/v1/promos/validate`
- **Request Body**: `{ "code": "RAYE10", "subtotal": 2890 }`
- **Success Response (200 OK)**:
```json
{
  "valid": true,
  "code": "RAYE10",
  "kind": "pct",
  "value": 10,
  "discountAmount": 289,
  "label": "10% off"
}
```

### 2.5 Record Fit Session
- **Endpoint**: `POST /api/v1/fit-sessions`
- **Request Body**:
```json
{
  "heightCm": 175,
  "weightKg": 70,
  "recommendedSize": "M",
  "addedToBag": true
}
```
- **Success Response (201 Created)**: `{ "success": true }`

---

## 3. Back-Office Admin Endpoints

### 3.1 Overview Telemetry & KPIs
- **Endpoint**: `GET /api/v1/overview`
- **Success Response (200 OK)**:
```json
{
  "monthSales": 595890,
  "ordersToPack": 4,
  "averageOrderValue": 3120,
  "salesChart": [
    { "month": "Nov", "revenue": 520000 },
    { "month": "Oct", "revenue": 595890 }
  ],
  "toPackQueue": [],
  "runningLowStock": []
}
```

### 3.2 List Orders (Kanban & Table)
- **Endpoint**: `GET /api/v1/orders`
- **Query Params**: `status`, `search`, `payment`, `view`
- **Success Response (200 OK)**: List of orders with items, customer details, and history.

### 3.3 Update Order Status (Kanban Drag & Drop / Restock)
- **Endpoint**: `PATCH /api/v1/orders/:id/status`
- **Request Body**: `{ "status": "packing" | "shipped" | "delivered" | "returned" }`
- **Success Response (200 OK)**: Updated order. When status is `returned`, auto-increments product stock!

### 3.4 Adjust Product Stock / Price
- **Endpoint**: `PATCH /api/v1/products/:slug/stock`
- **Request Body**: `{ "size": "M", "delta": 1 }` or `{ "bulk": 10 }`
- **Endpoint**: `PATCH /api/v1/products/:slug/price`
- **Request Body**: `{ "price": 2990 }`

### 3.5 Store Settings & Payment Toggles
- **Endpoint**: `GET /api/v1/settings`
- **Endpoint**: `PATCH /api/v1/settings`
- **Request Body**:
```json
{
  "storeName": "Shifatdevs",
  "lowStock": 3,
  "paymentToggles": { "cod": true, "bkash": true, "nagad": true, "card": true },
  "notificationToggles": { "order": true, "lowStock": true, "returns": true }
}
```

### 3.6 Reset Seed Demo Data
- **Endpoint**: `POST /api/v1/admin/reset-seed`
- **Success Response (200 OK)**: `{ "success": true, "message": "Baseline seed restored" }`
