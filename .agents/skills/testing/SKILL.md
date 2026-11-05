---
name: testing
description: Workflow for verification, unit testing, integration testing, end-to-end testing, and acceptance verification with Thanos.
---

# Testing and Verification Workflow (Thanos)

## Purpose
Guide the QA and Verification Specialist (`thanos`) to enforce strict quality control, verify acceptance criteria, and snap bugs out of existence.

## Testing Hierarchy
1. **Focused Unit Tests**: Verify individual functions, utility methods, React components, and NestJS services. Run immediately after code modification.
2. **Integration Tests**: Verify interactions between controllers, services, database models, and external APIs.
3. **End-to-End (E2E) Tests**: Verify complete user flows across frontend and backend boundaries (e.g., registration -> email verification -> login -> dashboard).
4. **Contract Tests**: Verify that HTTP endpoints return exact JSON shapes as documented in `docs/08-api-contract.md`.
5. **Acceptance Criteria Verification**: Cross-reference the implementation against `docs/13-acceptance-criteria.md`.

## Step-by-Step Procedure

### 1. Identify Changed Files & Tasks
- Review Git status or the changed file list reported in `planning/task.md`.

### 2. Execute Focused Verification
- Run the most focused test first:
  ```bash
  # Frontend focused test
  pnpm --filter frontend test -- path/to/component.test.tsx

  # Backend focused test
  pnpm --filter backend test -- path/to/service.spec.ts
  ```

### 3. Diagnose Failures
When a failure occurs, categorize it:
- **Code Bug**: Implementation defect -> report exact stack trace and delegate fix to domain agent (Friday/Edith/Thor).
- **Test Defect**: Flaky test or incorrect assertion -> update test spec.
- **Environment**: Missing database or `.env` variable -> notify Ultron/developer.

### 4. Acceptance Certification
A task is certified `DONE` only when:
- All required acceptance criteria have passed.
- Actual test execution logs confirm 0 failures.
- No untested edge cases or console errors are present.
