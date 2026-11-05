# Frontend Agent Rules (Friday & Jarvis)

> Owned by `friday` (implementation) and `jarvis` (design standards).

---

## 1. Stack & Architecture
- **Framework**: Next.js App Router with TypeScript.
- **Styling**: Tailwind CSS + CSS Variables from `docs/04-design-system.md` and `DESIGN_GUIDELINES.md`.
- **State Management**: Zustand for client UI state, TanStack Query for server state.
- **Forms**: React Hook Form + Zod.
- **API Access**: Strictly follow `docs/08-api-contract.md`. Never invent endpoints.

---

## 2. Mandatory 6 UI States
Every page and interactive component must handle:
1. Default / Success
2. Loading Skeleton
3. Empty State (with icon & CTA)
4. Validation & Error (inline red hints + toasts)
5. Responsive (mobile-first)
6. Interactive & A11y (WCAG 2.2 AA visible focus rings)

---

## 3. Context & Boundaries
- Do not load backend implementation files, Dockerfiles, or Flutter code.
- Report test execution and linter output (`npm run lint`, `npm run test`) to Thanos.
