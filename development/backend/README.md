# Shifatdevs Raye MERN Backend API (`development/backend/`)

> Maintained by `edith`. Consulted by `friday`, `iron_man`, and `thanos`.

This directory houses the Node.js Express REST API backend and Mongoose models for the Raye Striped-Shirt Apparel Suite.

## Stack Overview
- **Framework**: Express.js (Node.js v22 LTS)
- **Language**: TypeScript 5 (Strict Mode)
- **Data Layer**: Mongoose 8 + Fallback In-Memory Deterministic Seeded Store (`seed = 220`)
- **Validation**: Zod schema validation middleware
- **Testing**: Jest + Supertest test suite (`test/api.test.ts`)
- **Port**: `4000` (configurable via `PORT` environment variable)

## API Endpoints (`/api/v1`)
- **Storefront & Catalog**:
  - `GET /api/v1/products`: List and filter products (`cat`, `family`, `search`)
  - `GET /api/v1/products/:slug`: Get single product details
  - `POST /api/v1/orders`: Storefront Checkout & automatic CRM customer creation
  - `POST /api/v1/promos/validate`: Validate discount codes (`RAYE10`, `SALTAIR`)
  - `POST /api/v1/fit-sessions`: Telemetry recording from Size Finder
- **Admin Back-Office**:
  - `GET /api/v1/overview`: KPI metrics, sales chart aggregations, packing queue
  - `GET /api/v1/orders`: Kanban & table order listing
  - `PATCH /api/v1/orders/:id/status`: Kanban stage transitions (auto-restocks inventory on `returned`)
  - `PATCH /api/v1/products/:slug/stock`: Size-level or bulk stock adjustments
  - `PATCH /api/v1/products/:slug/price`: Retail price modification
  - `GET /api/v1/customers`: CRM customer listing & notes
  - `GET /api/v1/settings` & `PATCH /api/v1/settings`: Store settings & payment toggles
  - `POST /api/v1/admin/reset-seed`: Baseline demo data reset
- **Enterprise Modules**:
  - `GET /api/v1/manufacturer/batches`: Production batch progression
  - `GET /api/v1/manufacturer/suppliers`: Raw materials & trims supplier directory
  - `GET /api/v1/manufacturer/pos`: Factory Purchase Orders
  - `GET /api/v1/manufacturer/qc`: QC Inspection defect logs (AQL 2.5)
  - `GET /api/v1/stores/branches`: Flagship store branches
  - `GET /api/v1/stores/staff`: Store Managers & Stylists roster
  - `GET & PUT /api/v1/stores/shifts`: Weekly 7-day shift scheduling matrix
  - `GET & POST /api/v1/hr/candidates`: Applicant tracking pipeline
  - `POST /api/v1/hr/analyze-cv`: Live CV skill parsing & role-fit scoring

## Getting Started

```bash
cd development/backend
npm install
npm run dev # or npm run start:dev
```

The API will be available at [http://localhost:4000/api/v1](http://localhost:4000/api/v1).

## Verification & Build
```bash
npm run test:api  # Run Jest Supertest suite (31 automated tests)
npm run build     # Compile TypeScript to dist/
npm start         # Run compiled production server
```
