# TASK-002: Extract & Setup Admin Dashboard in `development/frontend/`

> **Status**: `READY`  
> **Assignee**: `jarvis`, `friday`  
> **Priority**: `P0`  
> **Dependencies**: `TASK-001`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As `jarvis` and `friday`, transfer and configure the complete e-commerce admin dashboard from `clay.zip` (unpacked in `input/clay_extracted/`) into `development/frontend/`, ensuring all 8 views (Overview, Orders Kanban, Products size-matrix, Customers CRM, Fit Insights, Promotions, Offline Assets, Settings), 34 high-res photos, GSAP animations, and glassmorphic styling run with zero errors.

---

## 2. Inputs & Context Documents
- **Extracted Source Code**: `input/clay_extracted/`
- **Design Tokens & Styles**: `input/clay_extracted/src/index.css`
- **Requirements**: [README.md](../../README.md) (REQ-F-001 through REQ-F-011)

---

## 3. Step-by-Step Execution Plan
1. Copy all assets (`public/`), styles (`src/index.css`), components, pages, stores, and utilities from `input/clay_extracted/` into `development/frontend/`.
2. Configure `development/frontend/package.json` and `vite.config.ts`.
3. Install frontend dependencies (`react`, `lucide-react`, `gsap`, `jszip`, `motion`, `tailwindcss`, etc.).
4. Verify build and type-checking pass without errors (`npm run build` or `tsc --noEmit`).

---

## 4. Expected Outputs
- `development/frontend/` fully operational with the complete back-office dashboard.
- All 34 images verified in `development/frontend/public/raye/photos/220-raye/`.

---

## 5. Acceptance Criteria
- [ ] Admin dashboard compiles cleanly without TypeScript errors.
- [ ] All 8 dashboard tabs render with 6 mandatory UI states.
- [ ] Pointer drag-and-drop Kanban board functions properly.

---

## 6. Verification Evidence (Thanos)
- **Command**: `cd development/frontend && npm run build`
- **Status**: `Pending`
