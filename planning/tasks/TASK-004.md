# TASK-004: Define API Contracts & DTO Schemas

> **Status**: `BACKLOG`  
> **Assignee**: `edith` (Backend & Data Architect)  
> **Priority**: `P0` (Critical)  
> **Dependencies**: `TASK-003`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As Backend and Data Specialist (`edith`), establish formal API contracts between frontend and backend in `docs/08-api-contract.md`, define strong TypeScript interfaces, and create NestJS DTOs with `class-validator` annotations.

---

## 2. Inputs & Context Documents
- **API Contract Specification**: [docs/08-api-contract.md](../../docs/08-api-contract.md)
- **Database Schema**: [development/backend/prisma/schema.prisma](../../development/backend/prisma/schema.prisma)
- **Skill Instructions**: [.agents/skills/api-contract-validation/SKILL.md](../../.agents/skills/api-contract-validation/SKILL.md)

---

## 3. Step-by-Step Execution Plan
1. Detail REST endpoints with exact HTTP methods, path, query parameters, and headers in `docs/08-api-contract.md`.
2. Define Request Body DTOs with strict validation annotations (`@IsString()`, `@IsEmail()`, `@MinLength()`, etc.).
3. Define Standard Success Response envelopes (`{ success: true, data: T, message: string }`).
4. Define Standard Error Response envelopes (`{ success: false, statusCode: number, message: string, errors?: string[] }`).
5. Share contract specifications with `friday` for client-side API client and type-safety alignment.

---

## 4. Expected Outputs
- `docs/08-api-contract.md` populated with comprehensive endpoint definitions.
- Request and Response TypeScript DTO files created in backend modules.

---

## 5. Acceptance Criteria
- [ ] Every endpoint has defined request body, query params, headers, and response schema.
- [ ] HTTP status codes align with REST conventions (200, 201, 400, 401, 403, 404, 422, 500).
- [ ] Contract validation script passes: `./scripts/validate-contracts.sh`.

---

## 6. Verification Evidence (Thanos)
- **Command**: `./scripts/validate-contracts.sh`
- **Status**: `Pending Verification`
- **Output Log**: Awaiting execution.

---

## 7. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে TASK-005 শুরু করো।
```
