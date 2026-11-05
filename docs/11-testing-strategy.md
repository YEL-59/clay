# 11 — Testing Strategy & Verification

> Owned and maintained by `thanos`.

---

## 1. Test Matrix
| Level | Tool | Target Scope | Frequency |
|---|---|---|---|
| **Unit Tests** | Vitest / Jest | Pure functions, domain services, utility methods | On every file save / commit |
| **Component Tests** | React Testing Library | UI states, accessible labels, button clicks | On PR / task review |
| **Integration Tests** | Supertest | NestJS controllers, Prisma queries, DB transactions | Before marking task DONE |
| **E2E Tests** | Playwright | Full critical flows (Login -> Onboarding -> Checkout) | Pre-deployment milestone |

---

## 2. Thanos Quality Gate (Zero Unverified Code)
- A task is NEVER `DONE` based on an agent's claim alone.
- Real terminal output with 0 failures is required.
- If a test fails, Thanos captures logs and re-delegates to the responsible agent (Friday, Edith, or Thor).
