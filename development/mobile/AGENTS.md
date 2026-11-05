# Mobile Agent Rules (Thor)

> Owned by `thor`.  
> **Status**: Optional. Activated only when mobile development is explicitly requested.

---

## 1. Stack & Architecture
- **Framework**: Flutter (Dart >= 3.0).
- **Architecture**: Clean feature-first architecture (`core/`, `features/`).
- **State Management**: Flutter Riverpod or BLoC.
- **Networking**: `dio` connecting to the endpoints in `docs/08-api-contract.md`.
- **Security**: Store tokens securely via `flutter_secure_storage`.

---

## 2. Context & Boundaries
- Thor works exclusively within `development/mobile/`.
- Do not load Next.js web components, backend controller code, or Dockerfiles.
- If mobile development is not required for the project, Thor remains in sleeping mode.
