# TASK-010: Full Authentication Flow Verification

> **Status**: `BACKLOG`  
> **Assignee**: `thanos` (QA & Verification Specialist)  
> **Priority**: `P0` (Critical)  
> **Dependencies**: `TASK-008`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As QA and Testing Specialist (`thanos`), perform independent end-to-end and integration verification across the full authentication flow, testing happy paths, security edge cases, rate limiting, and failure states before approving the feature.

---

## 2. Inputs & Context Documents
- **API Contracts**: [docs/08-api-contract.md](../../docs/08-api-contract.md)
- **Acceptance Criteria**: [docs/13-acceptance-criteria.md](../../docs/13-acceptance-criteria.md)
- **Testing Skill Instructions**: [.agents/skills/testing/SKILL.md](../../.agents/skills/testing/SKILL.md)

---

## 3. Step-by-Step Execution Plan
1. Execute unit and integration tests in `development/backend/`:
   - `npm run test`
   - `npm run test:e2e`
2. Execute frontend linting and type checking in `development/frontend/`:
   - `npm run type-check`
   - `npm run lint`
3. Execute end-to-end user scenario:
   - Scenario A: Register user with valid data -> Expect 201 Created.
   - Scenario B: Login with created credentials -> Expect 200 OK + JWT.
   - Scenario C: Access protected resource with JWT -> Expect 200 OK.
   - Scenario D: Access protected resource without JWT -> Expect 401 Unauthorized.
   - Scenario E: Login with invalid password -> Expect 401 Unauthorized.
4. Record actual test command outputs and verification evidence.
5. If any bug is identified, report failure and block `DONE` transition until resolved.

---

## 4. Expected Outputs
- Test execution output logs.
- Defect report (if issues are discovered).
- Task status updated to `DONE` only upon 100% test pass.

---

## 5. Acceptance Criteria
- [ ] 100% of authentication unit, integration, and E2E tests pass.
- [ ] No unhandled exceptions or console errors.
- [ ] Actual terminal test outputs documented in Verification Evidence section below.

---

## 6. Verification Evidence (Thanos)
- **Command**: `npm run test && npm run test:e2e`
- **Status**: `Pending Verification`
- **Output Log**: Awaiting test execution.

---

## 7. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে TASK-011 শুরু করো।
```
