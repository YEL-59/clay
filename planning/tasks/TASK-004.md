# TASK-004: Expand Dashboard: Manufacturer Portal, Store HR & CV Checker in `development/dashboard/`

> **Status**: `DONE`  
> **Assignee**: `jarvis`, `friday` (UI/UX & Frontend Specialists)  
> **Priority**: `P0`  
> **Dependencies**: `TASK-003` (Frontend completed)  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As requested by the client:
1. **Manufacturer Portal**: Manage production batches, factory purchase orders (POs), raw material & fabric suppliers, and quality control (QC) inspection audits.
2. **Store Management**: Manage store branches, Store Managers and Sales Representatives rosters, monthly sales targets, commission tiers, and shift scheduling.
3. **HR Management & Candidate CV Checker**: Applicant tracking pipeline, resume/CV upload & preview, automated keyword and skills match scoring against job requirements, interview scheduling, and evaluation scorecards.

---

## 2. Modules Implemented in `development/dashboard/`
- **Page 1: `ManufacturerPage.tsx`**:
  - Production batch tracking (Cutting, Sewing, Ironing, QC Audit, Packaging, Dispatched).
  - Raw fabric & trims supplier directory (Padma Spinning, Chittagong Linens, Bengal Natural Trims, etc.).
  - Factory Purchase Orders (PO) with delivery lead times, unit costs, and advance payment status.
  - QC Inspection pass/fail rates and audit logs with tolerance and defect notes.
  - Interactive "New Batch", "Issue PO", and "Record QC Audit" modals.
- **Page 2: `StoreManagementPage.tsx`**:
  - Store branches (Gulshan Atelier, Dhanmondi Flagship, Uttara Hub, Chattogram Outlet, Sylhet Luxe Pavilion).
  - Staff rosters: Store Managers and Sales Associates with performance metrics, customer ratings, and commission rates.
  - Individual sales target vs. achieved progress bars and commission calculations.
  - Weekly shift schedule (Morning, Evening, Full Day, Off Day) with interactive shift assignment.
  - Interactive "Add Staff Associate" and "Adjust Monthly Target" modals.
- **Page 3: `HrInterviewPage.tsx` (CV & Interview Checker)**:
  - Job applicant pipeline (Applied, Screening, 1st Round, Skill Assessment, Final Interview, Offer Sent, Hired).
  - Interactive CV / Resume upload parser simulation with 3 pre-loaded real candidate samples and custom file/text paste.
  - Automated keyword and skills match scoring against job requirements (e.g., 94% match for Senior Retail Store Manager).
  - Skill tag highlighter: matched competencies (green) and gap requirements (coral/amber).
  - Interview scheduling modal and evaluator scorecard (1-5 ratings across 5 criteria + hiring decision).
- **Store & Navigation Architecture**:
  - `enterpriseStore.ts` with reactive external store (`useEnterpriseStore`) and `localStorage ('raye:enterprise:v1')` persistence.
  - Integrated into `ALL_PAGES`, `MAIN_TABS`, `PAGE_TITLES`, `App.tsx`, and `QuickDock.tsx`.

---

## 3. Acceptance Criteria
- [x] New tabs added to dashboard navigation (`TopNav`, `QuickDock`, `PAGE_TITLES`).
- [x] Manufacturer production and PO data fully interactive with status updates.
- [x] Store managers and salesmen roster with performance metrics and shift assignments.
- [x] CV Checker with interactive resume upload simulation, skill match percentage, and interview scheduling.
- [x] Clean compilation with zero TypeScript errors (`npm run build` passed in 459ms).

---

## 4. Verification Evidence (Thanos)
- **Commands**: `npm run build` in `development/dashboard/` (Passed in 459ms)
- **Browser Automation**: Subagent session verified navigation tabs, batch stage progression, shift schedule matrix, and interactive CV match score calculation.
- **Status**: `DONE`

