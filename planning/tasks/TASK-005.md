# TASK-005: Implement Express.js REST API Modular Controllers

> **Status**: `DONE`  
> **Assignee**: `edith`  
> **Priority**: `P0`  
> **Dependencies**: `TASK-004`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As `edith`, implement Express.js REST API endpoints in `development/backend/src/controllers/` matching all contracts in `docs/08-api-contract.md` to serve both the Storefront and Admin back office.

---

## 2. Inputs & Context Documents
- **API Contracts**: [docs/08-api-contract.md](../../docs/08-api-contract.md)
- **Data Models**: `development/backend/src/models/`

---

## 3. Step-by-Step Execution Plan
1. Implement controllers and routes:
   - `/api/v1/overview`: KPI metrics, sales chart aggregations, packing queue.
   - `/api/v1/products`: Product listings, stock adjustments, price edits.
   - `/api/v1/orders`: Order retrieval, storefront order creation, Kanban status updates (`new` → `packing` → `shipped` → `delivered` + returns restock), notes.
   - `/api/v1/customers`: Customer CRM listing, detail retrieval, notes.
   - `/api/v1/fit-sessions`: Telemetry recording.
   - `/api/v1/promos`: Promo listing, validation (`RAYE10`, `SALTAIR`), creation, deletion.
   - `/api/v1/settings`: Settings retrieval and update.
   - `/api/v1/admin/reset-seed`: Demo data reset endpoint.
   - Enterprise endpoints: `/api/v1/manufacturer/*`, `/api/v1/stores/*`, `/api/v1/hr/*`.
2. Add Zod validation middleware for all payloads.
3. Configure CORS, error handling middleware, and request logging.

---

## 4. Expected Outputs
- `src/controllers/*.ts` and `src/routes/*.ts`.
- `src/server.ts` entry point.

---

## 5. Acceptance Criteria
- [x] All endpoints in `docs/08-api-contract.md` respond with standardized JSON.
- [x] Dragging order to `returned` increments shirt stock per line item.
- [x] Placing order from storefront creates customer record and reflects on overview.

---

## 6. Verification Evidence (Thanos)
- **Command**: `npm run test:api`
- **Output**: 31 passed, 31 total (Test Suites: 1 passed, 1 total, Time: 3.256s)
- **Status**: `Passed`
