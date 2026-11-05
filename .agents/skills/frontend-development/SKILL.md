---
name: frontend-development
description: Workflow for building Next.js App Router components, screens, client state, forms, and API integrations with Friday.
---

# Frontend Development Workflow (Friday)

## Purpose
Guide the Frontend Specialist (`friday`) to implement performant, accessible, and resilient web interfaces in `development/frontend/`.

## Stack Standards
- Next.js (App Router), TypeScript (strict mode), Tailwind CSS.
- Client state: Zustand.
- Server state: TanStack Query (React Query).
- Forms: React Hook Form + Zod.

## Step-by-Step Procedure

### 1. Contract Verification
- Open `docs/08-api-contract.md` to review the exact API endpoint, request body, query params, response shape, and error codes.
- Do not guess or hallucinate backend routes.

### 2. Mandatory 6 UI States Implementation
Every page, table, and data-bound form must implement:
1. **Default / Success State**: Clean, crisp UI with active data rendering.
2. **Loading Skeleton State**: Tailored skeleton loader matching the exact shape of cards/rows.
3. **Empty State**: Icon, headline, friendly description, and action button.
4. **Validation & Error State**: Inline red helper text for input fields; toast notifications for API failure.
5. **Responsive State**: Mobile-first design, fluid grid, collapsible sidebar, table horizontal scroll.
6. **Interactive & Accessibility State**: Visible focus ring (`focus-visible:ring-2`), hover animations (`transition-all duration-200`), accessible ARIA labels.

### 3. API Integration
- Use a centralized API client with automatic token attachment and error interceptors.
- Handle network errors, 401 unauthorized redirects, and 422 validation errors gracefully.

### 4. Verification
- Run:
  ```bash
  pnpm --filter frontend type-check # or npm run type-check
  pnpm --filter frontend test       # or npm run test
  ```
- Inspect responsive behavior and keyboard accessibility.
