# 13 — Feature Acceptance Criteria

> Owned and verified by `thanos`.

---

## 1. Global Baseline Acceptance Checklist
Every completed feature must meet:
- [ ] TypeScript strict compilation without errors.
- [ ] No ESLint / linter warnings or errors.
- [ ] Unit and integration tests passed with evidence.
- [ ] Responsive UI verified on mobile (<640px) and desktop (>1024px).
- [ ] No unhandled Promise rejections or runtime console errors.

---

## 2. Feature Specific Criteria Matrix
| Feature ID | Feature Name | Acceptance Condition | Verification Method |
|---|---|---|---|
| `AC-AUTH-01` | User Login | Valid credentials return JWT; user redirected to `/dashboard` | E2E Playwright test |
| `AC-AUTH-02` | Invalid Login | Invalid credentials display inline error "Invalid email or password" | Component / Unit test |
| `AC-AUTH-03` | Protected Route | Unauthenticated visit to `/dashboard` redirects to `/login` | Next.js middleware test |
| `AC-DATA-01` | Data Fetching | Data fetching displays skeleton loader, then data, or empty state | Visual & React Testing Lib |
