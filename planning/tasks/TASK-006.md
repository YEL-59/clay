# TASK-006: Connect Frontend Storefront & Admin to Backend REST API

> **Status**: `READY`  
> **Assignee**: `friday`, `edith`  
> **Priority**: `P0`  
> **Dependencies**: `TASK-003`, `TASK-005`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As `friday`, connect the React 19 Frontend (both Storefront and Admin Dashboard) to the Node.js Express backend REST API (`/api/v1/*`), with seamless optimistic updates and offline-resilient caching.

---

## 2. Inputs & Context Documents
- **Frontend Codebase**: `development/frontend/`
- **API Contracts**: [docs/08-api-contract.md](../../docs/08-api-contract.md)

---

## 3. Step-by-Step Execution Plan
1. Create API client in `development/frontend/src/services/api.ts`.
2. Connect `adminStore.ts` to fetch from `/api/v1/overview`, `/api/v1/orders`, `/api/v1/products`, `/api/v1/customers`, etc.
3. Connect `ShopPage.tsx` to post orders to `/api/v1/orders` and validate promo codes via `/api/v1/promos/validate`.
4. Add proxy configuration in `vite.config.ts` for `/api` requests to backend on port 5000.

---

## 4. Expected Outputs
- `development/frontend/src/services/api.ts`
- Live integration with backend API.

---

## 5. Acceptance Criteria
- [ ] Storefront checkout saves order to backend.
- [ ] Admin Kanban board movements update order status in backend.
- [ ] Reset Demo button restores seed data via `/api/v1/admin/reset-seed`.

---

## 6. Verification Evidence (Thanos)
- **Status**: `Pending`
