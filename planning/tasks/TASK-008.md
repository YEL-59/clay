# TASK-008: Integrate Frontend Authentication with API

> **Status**: `BACKLOG`  
> **Assignee**: `friday` (Web Frontend Specialist)  
> **Priority**: `P0` (Critical)  
> **Dependencies**: `TASK-006`, `TASK-007`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As Web Frontend Specialist (`friday`), connect the Next.js login/registration screens to the NestJS authentication endpoints (`POST /api/v1/auth/login`, `POST /api/v1/auth/register`), handle JWT storage (httpOnly cookies or secure client state), handle 401 redirects, and provide seamless session restoration.

---

## 2. Inputs & Context Documents
- **API Contracts**: [docs/08-api-contract.md](../../docs/08-api-contract.md)
- **Frontend Auth Screens**: `development/frontend/src/app/(auth)/`
- **Environment Config**: `development/frontend/.env.local`

---

## 3. Step-by-Step Execution Plan
1. Create unified HTTP client or Axios/Fetch wrapper with base URL from `NEXT_PUBLIC_API_URL`.
2. Implement auth API service methods: `login()`, `register()`, `logout()`, `getProfile()`.
3. Set up Auth Context or Zustand store for user session state.
4. Wire login/registration form submission to auth API methods.
5. Handle error responses gracefully: map 401/409 errors to UI toast or alert messages.
6. Implement protected route middleware or layout guard for dashboard routes.

---

## 4. Expected Outputs
- `src/services/api/auth.ts` and `src/context/AuthContext.tsx` (or Zustand store).
- End-to-end connected login and registration flow in browser.

---

## 5. Acceptance Criteria
- [ ] Successful login redirects user to dashboard (`/dashboard`).
- [ ] Invalid credentials display user-friendly error message without page crash.
- [ ] JWT token stored securely and sent in Authorization header (`Bearer <token>`).
- [ ] Logged-out user visiting protected route is redirected to `/login`.

---

## 6. Verification Evidence (Thanos)
- **Status**: `Pending Verification`
- **Output Log**: Awaiting execution.

---

## 7. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে TASK-009 শুরু করো।
```
