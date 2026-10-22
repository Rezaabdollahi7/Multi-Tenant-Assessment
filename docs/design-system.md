# Design System

Direction chosen with the `ui-ux-pro-max` skill for a data-dense B2B security dashboard: **Swiss minimalism**, high contrast, grid-based, no ornament. Tokens live in [`apps/web/src/app/globals.css`](../apps/web/src/app/globals.css); components use them through Tailwind classes, never raw colours.

## Principles

1. **Data first.** Dense layouts (8–32px spacing scale), tabular numbers everywhere (`font-feature-settings: "tnum"`), no decorative imagery.
2. **Meaning never by colour alone.** Severity and status always show their name; colour reinforces it.
3. **Quiet motion.** Transitions of 150–250ms on hover and focus only; nothing moves on scroll. `prefers-reduced-motion` disables all of it.
4. **Accessible by default.** WCAG AA contrast in both themes, visible focus rings (`ring` token), keyboard-reachable everything, 40px minimum hit areas on touch.

## Colour

| Token                 | Light                 | Dark                  | Use                                            |
| --------------------- | --------------------- | --------------------- | ---------------------------------------------- |
| `primary`             | `#1e40af`             | `#60a5fa`             | Primary actions, active navigation, focus ring |
| `background` / `card` | `#f8fafc` / `#ffffff` | `#0b1220` / `#111a2e` | Page and surface                               |
| `foreground`          | `#0f172a`             | `#e2e8f0`             | Body text                                      |
| `muted-foreground`    | `#475569`             | `#94a3b8`             | Secondary text, captions                       |
| `border`              | `#e2e8f0`             | `#233047`             | Dividers, table rules                          |
| `destructive`         | `#dc2626`             | `#f87171`             | Destructive actions and errors                 |

### Severity

Each level has a solid colour (charts, indicators) and a text-on-surface pair (badges).

| Severity | Solid     | Badge text / surface (light) | Badge text / surface (dark) |
| -------- | --------- | ---------------------------- | --------------------------- |
| Critical | `#dc2626` | `#991b1b` on `#fee2e2`       | `#fca5a5` on `#3b0d0d`      |
| High     | `#ea580c` | `#9a3412` on `#ffedd5`       | `#fdba74` on `#3b1606`      |
| Medium   | `#ca8a04` | `#854d0e` on `#fef9c3`       | `#fde047` on `#352306`      |
| Low      | `#2563eb` | `#1e40af` on `#dbeafe`       | `#93c5fd` on `#172554`      |
| Info     | `#64748b` | `#334155` on `#f1f5f9`       | `#cbd5e1` on `#1e293b`      |

Tailwind utilities: `text-severity-high-foreground bg-severity-high-surface`, `fill-severity-high`, etc.

## Typography

- **Fira Sans** (400/500/600/700) for all UI text; **Fira Code** (400/500) for identifiers and codes. Both self-hosted at build time by `next/font`.
- Base size 14px in data views, 16px in forms; line height 1.5 for prose, 1.25 for table cells.

## Components

- Primitives are the official shadcn/ui **new-york** components (Radix), copied unmodified into `src/components/ui` except for import paths. Customise through tokens, not by editing them.
- Our reusable components live in `src/components/shared`, each with a Storybook story.
- Icons: `lucide-react` only, `aria-hidden` when decorative; icon-only buttons carry an `aria-label`.

## Themes

Light, dark and system, via `next-themes` (`class` strategy). Default: system.
