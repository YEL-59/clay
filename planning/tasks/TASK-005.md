# TASK-005: Build Frontend Foundation & Design System

> **Status**: `BACKLOG`  
> **Assignee**: `friday` (Web Frontend Specialist)  
> **Priority**: `P1` (High)  
> **Dependencies**: `TASK-002`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As Web Frontend Specialist (`friday`), set up Next.js App Router root layout, theme provider, global styles with Tailwind CSS, base typography, and reusable UI component primitives (Button, Input, Card, Modal, Skeleton).

---

## 2. Inputs & Context Documents
- **Design Guidelines**: [development/frontend/DESIGN_GUIDELINES.md](../../development/frontend/DESIGN_GUIDELINES.md)
- **Frontend App Config**: [development/frontend/package.json](../../development/frontend/package.json)
- **Skill Instructions**: [.agents/skills/frontend-development/SKILL.md](../../.agents/skills/frontend-development/SKILL.md)

---

## 3. Step-by-Step Execution Plan
1. Scaffold root Next.js files in `development/frontend/src/app/` (`layout.tsx`, `page.tsx`, `globals.css`).
2. Integrate design tokens from Jarvis (`DESIGN_GUIDELINES.md`) into Tailwind config and CSS root variables.
3. Build base primitive UI components in `development/frontend/src/components/ui/`:
   - `Button.tsx` (variants: primary, secondary, outline, ghost, destructive; with loading spinner state)
   - `Input.tsx` (with error border, label, helper text, and accessible focus ring)
   - `Card.tsx`
   - `Skeleton.tsx` (for loading placeholder states)
   - `Alert.tsx` (for success and error messages)
4. Verify typography rendering, dark mode toggling, and keyboard navigation.

---

## 4. Expected Outputs
- `src/app/layout.tsx` and `src/app/globals.css`.
- Core UI component primitives in `src/components/ui/`.
- Zero TypeScript and ESLint warnings.

---

## 5. Acceptance Criteria
- [ ] Root layout compiles without errors on `npm run build` or `npm run dev`.
- [ ] Primitive components implement all 6 UI states where applicable.
- [ ] Keyboard navigation and accessibility focus rings are verified.
- [ ] Dark mode toggle works cleanly without hydration mismatch.

---

## 6. Verification Evidence (Thanos)
- **Command**: `cd development/frontend && npm run type-check && npm run lint`
- **Status**: `Pending Verification`
- **Output Log**: Awaiting execution.

---

## 7. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে TASK-006 শুরু করো।
```
