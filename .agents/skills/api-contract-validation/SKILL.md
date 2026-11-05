---
name: api-contract-validation
description: Workflow for validating API request and response contracts between Edith (backend) and Friday/Thor (frontend/mobile).
---

# API Contract Validation Workflow

## Purpose
Ensure that frontend client calls and backend endpoint definitions remain strictly synchronized through `docs/08-api-contract.md`, avoiding integration defects and silent assumptions.

## Contract Structure Standard
For every endpoint documented in `docs/08-api-contract.md`:
1. **Method & Path**: `POST /api/v1/auth/login`
2. **Auth & Permissions**: `Public` or `Bearer JWT` (Role: `Admin`, `Member`)
3. **Request Headers & Query Params**: `page=1&limit=20&sort=desc`
4. **Request Body Schema**: Strict JSON/TypeScript representation
5. **Success Response (2xx)**: HTTP code and JSON payload shape
6. **Error Responses (4xx, 5xx)**: Standard error format:
   ```json
   {
     "statusCode": 400,
     "message": "Validation failed",
     "errors": ["email must be an email"]
   }
   ```

## Contract Change Procedure
1. **Change Initiation**: Identify the need for a modified or new endpoint.
2. **Contract Update**: Edith updates `docs/08-api-contract.md`.
3. **Notification**: Edith notes the update in `planning/updateplanning.md`.
4. **Implementation**:
   - Backend: Edith implements NestJS controller and DTO.
   - Frontend/Mobile: Friday or Thor implements TanStack Query / Dio client call matching the contract.
5. **Validation**: Run script `./scripts/validate-contracts.sh` or integration tests.
