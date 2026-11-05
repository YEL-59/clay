# 04 — Design System & UI Specifications

> Owned and maintained by `jarvis`.

---

## 1. Color Palette Tokens (Semantic CSS Variables)

```css
:root {
  /* Surfaces & Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-card: #ffffff;
  --border-subtle: #e2e8f0;

  /* Typography */
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;

  /* Brand / Primary */
  --primary: #4f46e5;         /* Indigo-600 */
  --primary-hover: #4338ca;   /* Indigo-700 */
  --primary-foreground: #ffffff;

  /* Semantic Feedback */
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;
}

.dark {
  --bg-primary: #0b0f19;
  --bg-secondary: #0f172a;
  --bg-card: #1e293b;
  --border-subtle: #334155;

  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --primary-foreground: #ffffff;
}
```

---

## 2. Typography Hierarchy
- **Font Family**: `Inter, system-ui, sans-serif`
- **Heading 1**: `2.25rem (36px)`, Bold, tracking tight (`tracking-tight`)
- **Heading 2**: `1.875rem (30px)`, SemiBold
- **Heading 3**: `1.5rem (24px)`, SemiBold
- **Body Regular**: `1rem (16px)`, Regular, line-height 1.5
- **Caption / Helper**: `0.875rem (14px)`, Regular, text-secondary

---

## 3. Mandatory 6 UI States Matrix
| State | Visual Requirement | Implementation Rule |
|---|---|---|
| **1. Default/Success** | Crisp data rendering, balanced padding | Follow card & grid layout |
| **2. Loading Skeleton** | Shimmer animation mirroring content shape | `<Skeleton className="h-6 w-32" />` |
| **3. Empty State** | Centered icon, headline, helpful description, CTA button | `<EmptyState icon={Folder} action={...} />` |
| **4. Error/Validation** | Inline red helper text and toasts for API errors | React Hook Form `<ErrorMessage />` |
| **5. Responsive** | Fluid adaptivity across mobile, tablet, and desktop | Tailwind `sm:`, `md:`, `lg:` utilities |
| **6. Interactive/A11y** | Visible focus rings (`focus-visible:ring-2`), hover transitions | WCAG 2.2 AA compliant contrast |
