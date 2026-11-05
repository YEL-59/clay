# 09 — Mobile Architecture (Flutter / Thor)

> Owned and maintained by `thor`.  
> **Status**: Optional (activated only when mobile is requested in `README.md`).

---

## 1. Directory Structure (`development/mobile/`)
```text
development/mobile/
├── lib/
│   ├── core/                   # Network client, theme, constants, error handling
│   ├── features/               # Feature-first modules
│   │   ├── auth/               # Auth UI screens, providers, data sources
│   │   └── dashboard/          # Dashboard views and widgets
│   ├── app.dart                # MaterialApp with GoRouter
│   └── main.dart               # Entry point
├── test/                       # Unit and widget tests
├── pubspec.yaml                # Flutter dependencies
└── AGENTS.md                   # Thor mobile agent rules
```

---

## 2. Architectural Conventions
- **State Management**: Flutter Riverpod or BLoC.
- **Networking**: `dio` with automatic interceptors for JWT renewal.
- **Secure Storage**: `flutter_secure_storage` for token persistence.
- **Design System**: Mirrors Jarvis design tokens via custom `ThemeExtension`.
