# TASK-007: Implement Frontend Login & Registration UI

> **Status**: `BACKLOG`  
> **Assignee**: `friday` (Web Frontend Specialist)  
> **Priority**: `P1` (High)  
> **Dependencies**: `TASK-002`, `TASK-005`  
> **Master Board**: [planning/task.md](../task.md)

---

## 1. Objective & User Story
As Web Frontend Specialist (`friday`), build beautiful, responsive, and accessible Login and Registration screens in Next.js (`/login`, `/register`) adhering to Jarvis's 6 UI states, with client-side form validation using React Hook Form and Zod.

---

## 2. Inputs & Context Documents
- **Design Guidelines**: [development/frontend/DESIGN_GUIDELINES.md](../../development/frontend/DESIGN_GUIDELINES.md)
- **UI Components**: `development/frontend/src/components/ui/`
- **UI States Strategy**: [docs/06-ui-ux-design.md](../../docs/06-ui-ux-design.md)

---

## 3. Step-by-Step Execution Plan
1. Create page routes: `src/app/(auth)/login/page.tsx` and `src/app/(auth)/register/page.tsx`.
2. Define validation schemas with `zod` (`loginSchema`, `registerSchema`).
3. Wire forms with `react-hook-form` and `@hookform/resolvers/zod`.
4. Implement all **6 Mandatory UI States**:
   - `Default`: Clean input fields, floating labels, subtle card elevation.
   - `Loading Skeleton`: Form skeleton while checking session status.
   - `Interactive/Submitting`: Spinner in submit button, disabled inputs to prevent double submission.
   - `Validation/Error`: Inline field error text and alert banner for API errors.
   - `Success`: Animated transition or redirect.
   - `Responsive`: Clean mobile layout (touch-friendly 44px+ targets).
5. Ensure WCAG 2.2 AA accessibility (proper labels, ARIA attributes, keyboard navigation).

---

## 4. Expected Outputs
- `src/app/(auth)/login/page.tsx` and `src/app/(auth)/register/page.tsx`.
- Form component with client-side Zod validation.

---

## 5. Acceptance Criteria
- [ ] Submitting empty or malformed inputs shows instant client-side validation errors.
- [ ] Keyboard navigation (Tab, Enter) operates seamlessly through all inputs.
- [ ] Button disables and displays loading indicator while submission is active.
- [ ] Responsive design verified on mobile (375px) and desktop (1280px+).

---

## 6. Verification Evidence (Thanos)
- **Command**: `cd development/frontend && npm run lint`
- **Status**: `Pending Verification`
- **Output Log**: Awaiting execution.

---

## 7. Fresh Session Handoff
```markdown
planning/updateplanning.md পড়ে TASK-008 শুরু করো।
```
