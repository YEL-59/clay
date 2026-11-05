# AI Context Policy

## Goal
Complete the assigned task correctly with the smallest sufficient context. Token efficiency must never override correctness, client intent, security, or test coverage.

## Context-loading protocol
1. Read root `AGENTS.md`.
2. Identify the requested task ID and read only its entry/details in `planning/task.md`.
3. Read the concise current snapshot in `planning/updateplanning.md` only for continuity or blockers.
4. Use `docs/context-map.md` to select required specification files.
5. Inspect the exact source files, tests, and direct dependencies needed for the task.
6. Expand context only if implementation details are unclear, a dependency is missing, a test fails, or a security/correctness concern requires it.

## Do not load by default
- Every document under `docs/`.
- The entire frontend and backend source tree.
- Full Git history or unrelated diffs.
- The complete session log or old conversation summaries.
- Full test logs when a concise failure summary is available.

## Canonical information
- Client intent: root `README.md`.
- Confirmed stack/settings: `project.config.md`.
- Technical contracts and architecture: relevant `docs/` files.
- Task state: `planning/task.md`.
- Current-session checkpoint: `planning/updateplanning.md`.
- Detailed implementation: source code and tests.
Do not copy the same information into multiple files unless a short cross-reference is useful.

## Editing and output
- Make focused changes; do not rewrite whole files for small edits.
- Reuse existing components, services, hooks, and utilities.
- Do not paste unchanged code or huge logs into the final response.
- Update only affected task/documentation records.
- Report tests as `Passed`, `Failed`, `Not run`, or `Blocked`, based on actual execution.

## When context is missing
- Inspect the relevant source or documentation before guessing.
- If a technical detail can be verified from the code, verify it.
- If a client decision is missing or ambiguous, record an open question and ask for confirmation.
- Never omit a required security rule or acceptance criterion merely to reduce context.
