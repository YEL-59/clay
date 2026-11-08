# Frontend UI/UX Design System Guidelines

This document establishes the mandatory design standards and rules for building the frontend application in `development/frontend/`. The AI Agent and developers must strictly adhere to these guidelines to ensure a premium, modern, accessible, and consistent user experience.

---

## 1. Design Philosophy & Aesthetic Standards

- **Modern & Premium Look**: Avoid basic, unstyled HTML or harsh generic colors (e.g., pure red `#ff0000`, basic blue `#0000ff`). Use tailored HSL color palettes, subtle gradients, soft borders, and balanced whitespace.
- **Visual Hierarchy**: Clear typography scale with high-contrast text (`text-slate-900` / `text-slate-50`), muted secondary labels (`text-slate-500` / `text-slate-400`), and well-defined primary call-to-actions (CTAs).
- **Subtle Elevation**: Use modern, soft shadows (`shadow-sm`, `shadow-md`, `shadow-lg`) and 1px delicate borders (`border-slate-200 dark:border-slate-800`) instead of heavy outlines.
- **Glassmorphism & Surface**: For modern overlays, dialogs, and sticky navbars, apply subtle backdrop blurs (`backdrop-blur-md bg-white/80 dark:bg-slate-900/80`).

---

## 2. Mandatory 6 UI States (Zero Missing States)

Every screen, table, form, and feature component MUST implement the following 6 states:

| UI State | Mandatory Requirement | Anti-Pattern to Avoid |
|---|---|---|
| **1. Default / Success** | Clean layout, crisp data display, accessible buttons, tooltips | Inconsistent padding, misaligned icons |
| **2. Loading State** | **Skeleton Loaders** mirroring the exact card/table/content shape | Blank white screen, generic circular spinner |
| **3. Empty State** | Relevant Lucide icon, explanatory headline, friendly description, and a primary CTA button | Plain text "No data found", blank white space |
| **4. Validation / Error** | Inline red helper text under invalid inputs, toast notifications for API failures | Silent failures, browser `alert()`, missing field hints |
| **5. Responsive State** | Mobile-first design; hamburger nav on mobile, collapsible sidebar, horizontal scroll for wide tables | Overflowing text, cut-off tables, unclickable mobile buttons |
| **6. Interactive / A11y** | Smooth hover elevation (`transition-all duration-200`), visible focus rings (`focus-visible:ring-2`), disabled opacity (`opacity-50 cursor-not-allowed`), ARIA attributes | Instant jarring color jumps, unnavigable keyboard focus |

---

## 3. Color Tokens & Semantic Palette

All components must consume theme variables or Tailwind utility classes mapped to these semantic roles:

```css
:root {
  /* Surface & Background */
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

  /* Feedback Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;
}

.dark {
  --bg-primary: #090d16;
  --bg-secondary: #0f172a;
  --bg-card: #131b2e;
  --border-subtle: #1e293b;

  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
}
```

---

## 4. Typography System

- **Primary Font**: `Inter`, `Outfit`, or `Plus Jakarta Sans` (from `next/font/google`).
- **Scale**:
  - `Display / Hero`: `text-4xl sm:text-5xl font-extrabold tracking-tight`
  - `Page Title (h1)`: `text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white`
  - `Section Title (h2)`: `text-xl font-semibold text-slate-800 dark:text-slate-100`
  - `Card Header (h3)`: `text-lg font-medium text-slate-800 dark:text-slate-200`
  - `Body`: `text-sm sm:text-base font-normal text-slate-600 dark:text-slate-300 leading-relaxed`
  - `Caption / Helper`: `text-xs font-medium text-slate-400 dark:text-slate-500`

---

## 5. Reusable Component Rules

1. **Buttons**:
   - `Primary`: Solid primary brand color with hover darken and active scale.
   - `Secondary`: Soft neutral background (`bg-slate-100 dark:bg-slate-800`) with subtle border.
   - `Outline`: Transparent background, 1px border, text matching surface.
   - `Ghost`: Completely transparent, background appears only on hover.
   - `Destructive`: Red background or red border for dangerous actions (delete, revoke).
   - *All buttons must support a `loading` prop showing a small spinner while keeping the button size fixed.*

2. **Forms & Inputs**:
   - Explicit labels above every input.
   - Subtitle/hint text when formatting is required.
   - Visual red outline (`border-rose-500`) and message below the input on error.
   - Clear placeholder text that acts as an example, not a replacement for a label.

3. **Tables & Lists**:
   - Styled column headers with uppercase `text-xs font-semibold text-slate-500`.
   - Alternating row hovers (`hover:bg-slate-50/75 dark:hover:bg-slate-800/50`).
   - Sticky table header on long scrolling pages.
   - Pagination controls or infinite scroll indicator at the bottom.

---

## 6. Iconography & Assets

- Use **`lucide-react`** exclusively for clean, consistent vector iconography.
- Set standard icon sizes: `w-4 h-4` for button/inline icons, `w-5 h-5` for navigation items, and `w-12 h-12` for empty state illustrations.
- Never leave broken or placeholder image tags (`/placeholder.png`). Use SVG fallback or dynamic avatars.
