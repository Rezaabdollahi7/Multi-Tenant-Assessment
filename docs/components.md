# Components

The reusable components of the web app live in `apps/web/src/components/shared`. Each one has Storybook stories for its states (`pnpm --filter frontend storybook`, then **Shared** in the sidebar). Each docs page lists the props from the JSDoc in the source. This file is the same reference in one place.

Feature components (`src/features/*/components`) compose these. The app shell (`src/components/app-shell`) and the shadcn/ui primitives (`src/components/ui`) are not covered here.

## Conventions

- **No UI text inside.** Callers pass labels already translated. The few components with fixed wording of their own (Try again, Pagination, Permission-denied) read it from `next-intl`, so they follow the chosen language.
- **Meaning never rests on colour alone.** Every badge, bar and chart part carries its label as text. Colour only reinforces it.
- **Logical direction.** Spacing and alignment use start/end, never left/right, and directional icons flip. Every component works right to left (Persian) and left to right (English).
- **Server or client.** Components without state or effects render on the server. `HeadlineStat`, `SegmentedBar`, `BreakdownList`, `SearchInput` and `FilterSelect` are client components, because they animate or hold input state.
- **Tested in a browser.** Every story is also a Vitest test in headless Chromium. It must render, pass its `play` function and have no axe accessibility violations. See `docs/RULES.md` §5.

## Layout

### Panel

A titled section of a page, in a card. The heading names the section for screen readers (`section` + `aria-labelledby`).

| Prop          | Type               | Default   | Description                                           |
| ------------- | ------------------ | --------- | ----------------------------------------------------- |
| `title`       | `string`           | required  | Section heading (`h2`).                               |
| `description` | `string`           |           | Line under the title.                                 |
| `action`      | `ReactNode`        |           | A link or button beside the title, e.g. "View all".   |
| `variant`     | `"glass" \| "ink"` | `"glass"` | `ink` is the dark feature card; one per page at most. |
| `children`    | `ReactNode`        | required  | The section's content.                                |
| `className`   | `string`           |           | Placement in the page grid, e.g. a column span.       |

Used by every Dashboard and Project details panel.

### DetailList

Label and value joined by a dotted leader, one pair per line. It renders a `<dl>`.

| Prop        | Type                                    | Default  | Description     |
| ----------- | --------------------------------------- | -------- | --------------- |
| `details`   | `{ label: string; value: ReactNode }[]` | required | Pairs in order. |
| `className` | `string`                                |          |                 |

Used by Project details ("About this Project") and Finding details.

## Figures and charts

### HeadlineStat

One large, light figure with a small icon and label under it. The figure counts up when it arrives, or appears at once under reduced motion. It renders a `dt`/`dd` pair, so place it inside a `<dl>`.

| Prop    | Type         | Default  | Description                                        |
| ------- | ------------ | -------- | -------------------------------------------------- |
| `label` | `string`     | required | What is counted.                                   |
| `value` | `number`     |          | Omitted while loading; a skeleton takes its place. |
| `icon`  | `LucideIcon` | required | Decorative icon beside the label.                  |

Used by the Dashboard headline (Projects, Findings, Critical and High).

### SegmentedBar

Parts of a whole side by side. Each part is a pill as wide as its share, with the share written inside and its label above. An empty part keeps a small pill. The four tones tell parts apart by look, not hue.

| Prop            | Type                        | Default  | Description                                     |
| --------------- | --------------------------- | -------- | ----------------------------------------------- |
| `segments`      | `Segment[]`                 | required | `{ id, label, value, tone }`, in reading order. |
| `describeValue` | `(value: number) => string` | required | Spoken after each label, e.g. "2 Projects".     |
| `className`     | `string`                    |          |                                                 |

`tone` is one of `"ink" | "highlight" | "hatch" | "outline"`. Used for Project Status on the Dashboard.

### BreakdownList

Each part of a whole as a labelled row with its count, its share and a bar on a hatched track. The bars grow in one after another.

| Prop        | Type              | Default  | Description                                                              |
| ----------- | ----------------- | -------- | ------------------------------------------------------------------------ |
| `items`     | `BreakdownItem[]` | required | `{ id, label, value, color }`; `color` is a CSS colour for the bar only. |
| `className` | `string`          |          |                                                                          |

Used for Findings by Severity on the Dashboard and on Project details.

## Lists and navigation

### DataTable

A semantic table of rows described by column definitions. While loading it shows skeleton rows and sets `aria-busy`. New rows fade up one after another.

| Prop          | Type                     | Default  | Description                                             |
| ------------- | ------------------------ | -------- | ------------------------------------------------------- |
| `caption`     | `string`                 | required | Describes the table to screen readers; visually hidden. |
| `columns`     | `DataTableColumn<Row>[]` | required | `{ id, header, cell(row), className? }`.                |
| `rows`        | `Row[] \| undefined`     | required | `undefined` while loading.                              |
| `getRowId`    | `(row: Row) => string`   | required | Stable key per row.                                     |
| `loadingRows` | `number`                 | `5`      | Skeleton rows while loading.                            |

A column's `className` applies to its header and every cell, e.g. `hidden sm:table-cell` to drop a column on phones. Used by the Projects and Findings lists.

### Pagination

The position in a list, with round links to the neighbouring and numbered pages. The page items are always the first and last page, the current one and its neighbours, with a gap wherever pages are skipped. Pages are real links, so they can be opened in a new tab. The current page has `aria-current="page"`.

| Prop          | Type                       | Default  | Description                                             |
| ------------- | -------------------------- | -------- | ------------------------------------------------------- |
| `meta`        | `PaginationMeta`           | required | `{ page, limit, totalItems, totalPages }` from the API. |
| `totalLabel`  | `string`                   | required | How many items there are, e.g. "23 Projects".           |
| `hrefForPage` | `(page: number) => string` | required | The URL of a page.                                      |

`pageItems(page, totalPages)` is exported and unit-tested.

### SearchInput

A search box that waits for a 300ms pause in typing before searching, then searches with the trimmed text. It follows `value` when that changes from outside, e.g. on Back or "Clear filters".

| Prop        | Type                      | Default  | Description                            |
| ----------- | ------------------------- | -------- | -------------------------------------- |
| `label`     | `string`                  | required | Accessible name, also the placeholder. |
| `value`     | `string`                  | required | The applied search, e.g. from the URL. |
| `onSearch`  | `(value: string) => void` | required | Called once typing pauses.             |
| `className` | `string`                  |          |                                        |

### FilterSelect

A single-choice filter with an "all" option.

| Prop        | Type                                  | Default  | Description                                  |
| ----------- | ------------------------------------- | -------- | -------------------------------------------- |
| `label`     | `string`                              | required | Accessible name, e.g. "Project Status".      |
| `allLabel`  | `string`                              | required | The "no filter" option, e.g. "All statuses". |
| `options`   | `readonly { value; label }[]`         | required | The choices.                                 |
| `value`     | `Value \| undefined`                  | required | The applied filter; `undefined` is none.     |
| `onChange`  | `(value: Value \| undefined) => void` | required |                                              |
| `className` | `string`                              |          |                                              |

`Value` is the string union of the options, so `onChange` is typed to them.

## Status

### SeverityBadge

A Finding's Severity, always as text. Each level has its own tinted surface, with AA contrast in both themes.

| Prop        | Type              | Default  | Description                                    |
| ----------- | ----------------- | -------- | ---------------------------------------------- |
| `severity`  | `FindingSeverity` | required | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` or `INFO`. |
| `className` | `string`          |          |                                                |

### StatusBadge

The state of something in its life, such as a Project Status or a Finding Status: a pill with a dot.

| Prop        | Type         | Default  | Description                                                         |
| ----------- | ------------ | -------- | ------------------------------------------------------------------- |
| `label`     | `string`     | required | The state, already translated.                                      |
| `tone`      | `StatusTone` | required | `neutral`, `active`, `positive` or `inactive`; the dot and surface. |
| `className` | `string`     |          |                                                                     |

`lib/status.ts` maps each Project Status and Finding Status to its tone.

### UserAvatar

A round badge with up to two initials of a User. It is decorative (`aria-hidden`); the name is always written beside it.

| Prop        | Type             | Default  | Description                                  |
| ----------- | ---------------- | -------- | -------------------------------------------- |
| `name`      | `string \| null` | required | The User's name.                             |
| `fallback`  | `string`         | required | Used for the initials when there is no name. |
| `className` | `string`         |          |                                              |

`initials(name, fallback)` is exported; the user menu uses it too.

## Forms

### FormField

A labelled form control with its hint and validation error. It passes its control the `id`, `aria-invalid` and `aria-describedby` that tie the label, hint and error together. A screen reader then reads the error with the field.

| Prop       | Type                                        | Default  | Description                                    |
| ---------- | ------------------------------------------- | -------- | ---------------------------------------------- |
| `id`       | `string`                                    | required | The control's id.                              |
| `label`    | `string`                                    | required |                                                |
| `hint`     | `string`                                    |          | Guidance under the label, e.g. a length limit. |
| `error`    | `string`                                    |          | Shown under the control and announced with it. |
| `children` | `(control: FieldControlProps) => ReactNode` | required | Renders the control with the given props.      |

```tsx
<FormField id="title" label={t("title")} error={errors.title?.message}>
  {(control) => <Input {...control} {...register("title")} />}
</FormField>
```

## Page states

These three replace content that cannot be shown. When one stands in for a whole page (not-found, error, Permission-denied), its title is the page's `h1`.

### EmptyState

Shown in place of a list or chart that has nothing to show yet.

| Prop          | Type          | Default  | Description                                           |
| ------------- | ------------- | -------- | ----------------------------------------------------- |
| `title`       | `string`      | required |                                                       |
| `description` | `string`      |          |                                                       |
| `icon`        | `LucideIcon`  |          | Decorative icon above the title.                      |
| `action`      | `ReactNode`   |          | A next step, such as a link to create the first item. |
| `titleAs`     | `"p" \| "h1"` | `"p"`    | `h1` when the state stands in for the whole page.     |
| `className`   | `string`      |          |                                                       |

### ErrorState

Replaces content that failed to load. It has `role="alert"`, so screen readers announce it.

| Prop          | Type          | Default  | Description                                       |
| ------------- | ------------- | -------- | ------------------------------------------------- |
| `title`       | `string`      | required | What failed, e.g. "Could not load Findings".      |
| `description` | `string`      |          | Detail under the title.                           |
| `onRetry`     | `() => void`  |          | Offers a "Try again" button when given.           |
| `titleAs`     | `"p" \| "h1"` | `"p"`    | `h1` when the state stands in for the whole page. |
| `className`   | `string`      |          |                                                   |

### PermissionDenied

Stands in for a page the User's Role has no Permission for, e.g. a Viewer opening "Report Finding" directly. The API rejects the action either way; this page only explains it.

| Prop     | Type        | Default  | Description                               |
| -------- | ----------- | -------- | ----------------------------------------- |
| `title`  | `string`    | required | What the User cannot do; the page's `h1`. |
| `action` | `ReactNode` |          | A way out, such as a link back.           |
