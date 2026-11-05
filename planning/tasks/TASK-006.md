# TASK-006: Implement Backend Core Authentication API

> **Status**: `BACKLOG`  
> **Assignee**: `edith` (Backend & Data Architect)  
> **Priority**: `P0` (Critical)  
> **Dependencies**: `TASK-004`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As Backend and Data Specialist (`edith`), implement secure JWT authentication in NestJS, including User registration, password hashing with bcrypt, login with JWT issuance, refresh token rotation, and JWT guard middleware.

---

## 2. Inputs & Context Documents
- **API Contracts**: [docs/08-api-contract.md](../../docs/08-api-contract.md)
- **Security Plan**: [docs/10-security-plan.md](../../docs/10-security-plan.md)
- **Prisma Schema**: [development/backend/prisma/schema.prisma](../../development/backend/prisma/schema.prisma)

---

## 3. Step-by-Step Execution Plan
1. Create `AuthModule`, `AuthController`, and `AuthService` in `development/backend/src/modules/auth/`.
2. Implement `RegisterDto` and `LoginDto` with `class-validator` decorators.
3. Configure `bcrypt` with minimum 10 salt rounds for password hashing.
4. Implement JWT signing with access token (short TTL: 15m) and secure refresh token (long TTL: 7d).
5. Implement `JwtAuthGuard` and `@CurrentUser()` parameter decorator.
6. Enable CORS in `main.ts` for frontend origin (`http://localhost:3000`) with credentials enabled.
7. Write unit tests for `AuthService` covering successful login and invalid credentials.

---

## 4. Expected Outputs
- `src/modules/auth/` containing complete authentication logic.
- Protected route decorator `@UseGuards(JwtAuthGuard)`.
- Unit tests in `src/modules/auth/auth.service.spec.ts`.

---

## 5. Acceptance Criteria
- [ ] Valid credentials return HTTP 200 with JWT access token.
- [ ] Invalid credentials return HTTP 401 with standard error format.
- [ ] Duplicate email registration returns HTTP 409 Conflict.
- [ ] Passwords are never returned in response DTOs or logged in server logs.

---

## 6. Verification Evidence (Thanos)
- **Command**: `cd development/backend && npm run test`
- **Status**: `Pending Verification`
- **Output Log**: Awaiting execution.

---

## 7. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে TASK-007 শুরু করো।
```
