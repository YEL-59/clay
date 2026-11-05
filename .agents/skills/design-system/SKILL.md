---
name: design-system
description: Workflow for establishing design tokens, typography scale, color palettes, dark mode, and UI component primitives with Jarvis.
---

# Design System Workflow (Jarvis)

## Purpose
Guide the Design Specialist (`jarvis`) to construct a coherent, accessible, and premium design system before mass frontend component implementation begins.

## Key Deliverables
1. **Design Tokens (`globals.css` / Tailwind Config)**:
   - Surface colors: `--bg-primary`, `--bg-secondary`, `--bg-card`, `--border-subtle`.
   - Typography colors: `--text-primary`, `--text-secondary`, `--text-muted`.
   - Brand colors: `--primary`, `--primary-hover`, `--primary-foreground`.
   - Feedback colors: `--success`, `--warning`, `--danger`, `--info`.
   - Elevation shadows: soft, modern 1px delicate borders and layered shadows.
2. **Typography Scale**:
   - Central font: Google Fonts (Inter / Plus Jakarta Sans).
   - Strict hierarchical sizing (H1 to H6, body-sm, body-md, caption).
3. **Core UI Primitives**:
   - `Button`: Primary, Secondary, Outline, Ghost, Danger with loading/disabled states.
   - `Input` & `Textarea`: Clear borders, focus-visible rings, inline error state.
   - `Card`: Surface elevation, padding rules, header/content/footer slots.
   - `Skeleton`: Pulsing skeleton shapes for text, avatars, cards, and tables.
   - `EmptyState`: Centered graphic/icon, title, message, and call-to-action button.
   - `Badge` / `Tag`: Semantic status indicators.

## Step-by-Step Procedure
1. Inspect `README.md` for client brand guidelines or Figma URLs.
2. Update `docs/04-design-system.md` with semantic token values.
3. Apply variables in `development/frontend/src/styles/globals.css`.
4. Build reusable primitives in `development/frontend/src/components/ui/`.
5. Verify contrast ratios against WCAG 2.2 AA (minimum 4.5:1 for normal text).
