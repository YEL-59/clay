# TASK-002: Define Design Tokens & UI States

> **Status**: `BACKLOG`  
> **Assignee**: `jarvis` (UI/UX Specialist)  
> **Priority**: `P1` (High)  
> **Dependencies**: `TASK-001`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As UI/UX specialist (`jarvis`), establish the unified design system, color tokens, typography scales, spacing units, dark mode support, and the 6 mandatory UI states for all screens in coordination with Friday.

---

## 2. Inputs & Context Documents
- **Design Guidelines**: [development/frontend/DESIGN_GUIDELINES.md](../../development/frontend/DESIGN_GUIDELINES.md)
- **UI/UX Strategy**: [docs/06-ui-ux-design.md](../../docs/06-ui-ux-design.md)
- **Client Branding in README**: [README.md](../../README.md)

---

## 3. Step-by-Step Execution Plan
1. Extract brand colors, fonts, and theme preferences from `README.md`.
2. Configure Tailwind CSS color tokens, shadows, and border radii matching the brand identity.
3. Establish typographic scale (H1-H6, Body, Caption) using modern sans-serif fonts.
4. Define standard reusable component patterns for the **6 Mandatory UI States**:
   - `Default / Success`
   - `Loading Skeleton`
   - `Empty State` (with call-to-action)
   - `Validation / Error State`
   - `Responsive Layout` (Mobile, Tablet, Desktop)
   - `Interactive / Hover / Focus State` (WCAG 2.2 AA compliant)
5. Review with `friday` for direct frontend code implementation.

---

## 4. Expected Outputs
- `development/frontend/DESIGN_GUIDELINES.md` updated with exact CSS variables and Tailwind tokens.
- UI component design tokens verified for both Light and Dark themes.

---

## 5. Acceptance Criteria
- [ ] Tailwind tokens reflect approved client branding colors and typography.
- [ ] All 6 mandatory UI states explicitly documented with code patterns.
- [ ] WCAG 2.2 AA minimum 4.5:1 color contrast ratio verified.
- [ ] Accessible focus rings (`focus-visible:ring-2`) specified for all interactive elements.

---

## 6. Verification Evidence (Thanos)
- **Status**: `Pending Verification`
- **Output Log**: Awaiting execution.

---

## 7. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে TASK-003 শুরু করো।
```
