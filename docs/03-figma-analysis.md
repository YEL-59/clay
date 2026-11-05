# 03 — Figma & UI Screen Inventory

> Maintained by `jarvis`.

---

## 1. Design References
- **Figma File URL**: [Figma Link or "No Figma - Built using Jarvis Design System"]
- **Target Aesthetic**: Modern, clean, balanced whitespace, subtle elevation.

---

## 2. Screen & Page Inventory
| Screen ID | Page / Route | Core Purpose | Key Components | Required UI States |
|---|---|---|---|---|
| `SCR-001` | `/login` | User authentication | LoginForm, SocialButtons | Default, Loading, Error, Focus |
| `SCR-002` | `/dashboard` | KPI overview & recent activity | MetricCards, ActivityTable | Default, Loading Skeleton, Empty, Error, Responsive |
| `SCR-003` | `/settings` | User profile & security preferences | ProfileForm, PasswordModal | Default, Loading, Validation, Focus |

---

## 3. Responsive Breakpoints
- **Mobile**: `< 640px` (single column, drawer navigation)
- **Tablet**: `640px - 1024px` (adaptive 2-column grid)
- **Desktop**: `> 1024px` (collapsible sidebar, multi-column cards, full tables)
