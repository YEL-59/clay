# Development Directory Rules (Avengers Protocol)

> Applies to all code under `development/`.

---

## 1. Domain Ownership
- **`development/frontend/`**: Owned by **Friday** (implementation) and **Jarvis** (design standards).
- **`development/backend/`**: Owned by **Edith** (controllers, services, database models, migrations).
- **`development/mobile/`**: Owned by **Thor** (optional Flutter app).

---

## 2. Cross-Domain Communication
- Agents must NOT directly write code into another agent's domain without an assigned multi-domain task or delegation.
- Communication between frontend/mobile and backend is mediated **exclusively through `docs/08-api-contract.md`**.

---

## 3. Mandatory Standards
- **TypeScript Strict Mode**: No implicit `any`. All data types must be defined.
- **Validation**: Client validates for UX; backend validates for security.
- **Verification**: Thanos must verify tests before any task is marked `DONE`.
