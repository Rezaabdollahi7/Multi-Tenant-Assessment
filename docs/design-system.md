# Design System

The visual language follows the project owner's reference boards: **warm, quiet and roomy**. A cool grey page warms to cream towards the bottom end; content sits on translucent white "glass" cards; ink (near black) marks primary actions and the one dark feature card; a single yellow highlights what matters now. Tokens live in [`apps/web/src/app/globals.css`](../apps/web/src/app/globals.css); components use them through Tailwind classes, never raw colours.

## Principles

1. **Few colours, used on purpose.** Ink for action and emphasis, yellow for the one thing to notice (the active segment, the busiest day, the hovered row), grey and texture for the rest. Severity keeps its own scale because its meaning is conventional.
2. **Meaning never by colour alone.** Severity and status always show their name; segments tell parts apart by look (solid, bright, outlined, hatched) as well as by label.
3. **Large, light headings and figures; calm body text.** One big number per idea.
4. **Pills and soft corners.** Controls are full pills; cards use a generous radius.
5. **Both directions, both themes.** Logical properties only (`ms-*`, `start-*`, `text-start`); every token has a dark value. Contrast is WCAG AA for text in both themes.

## Colour

| Token                      | Light                        | Dark                        | Use                                                   |
| -------------------------- | ---------------------------- | --------------------------- | ----------------------------------------------------- |
| `background`               | `#e9eaec` + ambient gradient | `#141414` + faint warm glow | Page                                                  |
| `card`                     | white at 66% (glass)         | `#242423` at 70%            | Panels, tables, forms (`glass` utility adds the edge) |
| `foreground`               | `#1c1c1b`                    | `#f2f2f0`                   | Text                                                  |
| `muted-foreground`         | `#5f5f5c` (6.0:1 on card)    | `#a8a8a3` (6.9:1)           | Secondary text                                        |
| `primary`                  | `#2b2b2a` ink                | `#f2f2f0`                   | Primary buttons, active navigation, current page      |
| `highlight`                | `#ffd861`                    | `#ffd861`                   | Active segment, busiest day, hovered row (with text)  |
| `ink`                      | `#2b2b2a`                    | `#0b0b0b`                   | The dark feature card (recent Activity)               |
| `success`                  | `#36690f` on `#e4f2cf`       | `#a3d977` on green at 12%   | "Done" status pills (Completed, Resolved)             |
| `destructive`              | `#d92d20`                    | `#ff6b6b`                   | Delete, errors                                        |
| `border` / `border-strong` | ink at 8% / 16%              | white at 9% / 18%           | Dividers, outlined pills, hatch strokes               |

Sampled from the reference: yellow `#FFD861`, ink `#2B2B2A`, page `#E3E5E6` warming to `#FAECB8`.

### Severity

Each level has a solid colour (bars) and a text-on-surface pair (badges); every pair meets AA.

| Severity | Solid     | Badge text / surface (light) | Badge text / surface (dark) |
| -------- | --------- | ---------------------------- | --------------------------- |
| Critical | `#dc2626` | `#991b1b` on `#fee2e2`       | `#fca5a5` on `#3b0d0d`      |
| High     | `#ea580c` | `#9a3412` on `#ffedd5`       | `#fdba74` on `#3b1606`      |
| Medium   | `#ca8a04` | `#854d0e` on `#fef9c3`       | `#fde047` on `#352306`      |
| Low      | `#2563eb` | `#1e40af` on `#dbeafe`       | `#93c5fd` on `#172554`      |
| Info     | `#64748b` | `#334155` on `#f1f5f9`       | `#cbd5e1` on `#1e293b`      |

The Finding trend is one series in ink with the busiest day in yellow: stacked by Severity, these five colours fail colour-blind separation, so the per-day split is given as text in the tooltip and the screen-reader table.

## Texture and surfaces

- `glass`: translucent card colour, a 1px light top edge and a soft shadow. Falls back to an opaque card under `prefers-reduced-transparency`.
- `bg-hatch`: diagonal hatching for "the rest" of a bar and for set-aside states (Archived), so it never competes with a value.

## Typography

- **Dana** (200–700) for all UI text in Persian and English, self-hosted with `next/font/local` from `src/app/fonts/dana`. Commercial typeface by fontiran.com, used under the project owner's licence.
- Page titles `text-display` (40px) light; headline figures `text-hero` (56px) extra-light; card titles 20px regular; body 14–16px.
- Figures use tabular numerals; Persian gets Persian digits from the formatter. User-entered text is isolated with `<bdi>` / `dir="auto"` so English titles keep their punctuation inside Persian.

## Shape

Radius scale: 10 / 14 / 18 / 22 / **28 (cards)** / 36 (large containers, dialogs). Buttons, inputs, selects, badges and navigation are full pills; text areas and menus use 28 and 22.

## Components

- Primitives are the official shadcn/ui **new-york** components (Radix) in `src/components/ui`. They differ from upstream only in import paths, logical inline properties (so they mirror in right-to-left), and the shapes above (pill controls, glass cards).
- Our reusable components live in `src/components/shared`, each with a Storybook story: `Panel` (glass or ink), `HeadlineStat`, `SegmentedBar`, `BreakdownList`, `DataTable`, `DetailList`, `Pagination`, `SearchInput`, `FilterSelect`, `StatusBadge`, `SeverityBadge`, `UserAvatar`, `FormField`, `EmptyState`, `ErrorState`, `PermissionDenied`.
- Icons: `lucide-react` only, `aria-hidden` when decorative; icon-only buttons carry an `aria-label`; directional icons mirror with `rtl:rotate-180`.

## Layout

A floating top bar: the brand in an outlined pill at the start, the sections as a pill group in the centre (current one in ink), and round glass buttons for language, theme and the User at the end. On small screens the sections drop to a full-width row under it. Content is centred up to 1440px.

## Themes

Light, dark and system, via `next-themes` (`class` strategy). Default: system.
