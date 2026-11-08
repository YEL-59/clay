# TASK-007: Full MERN Flow Verification & Thanos Testing

> **Status**: `BACKLOG`  
> **Assignee**: `thanos`  
> **Priority**: `P0`  
> **Dependencies**: `TASK-006`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As `thanos`, execute comprehensive end-to-end testing across the full MERN stack to ensure zero-defect compliance with all client requirements in `README.md`.

---

## 2. Inputs & Context Documents
- **Acceptance Criteria**: [docs/13-acceptance-criteria.md](../../docs/13-acceptance-criteria.md)
- **Frontend**: `development/frontend/`
- **Backend**: `development/backend/`

---

## 3. Step-by-Step Execution Plan
1. Test Storefront checkout flow: Add to bag → Enter code `RAYE10` → Place order with COD → Verify order ID `RY-XXXXX` appears on Admin Kanban board.
2. Test Kanban fulfillment: Drag order from `New` to `Packing` to `Shipped` to `Delivered`.
3. Test Return & Restock: Move order to `Returned` and verify product stock increments.
4. Test Size Finder calculations with boundary cases (height 150cm, 195cm; weight 45kg, 105kg).
5. Test Admin Demo Data Reset endpoint.

---

## 4. Expected Outputs
- Verification test report in `planning/updateplanning.md`.
