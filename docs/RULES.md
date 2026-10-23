# Engineering Rules

These rules are binding for every change, human- or AI-written. A reviewer should be able to point at any line and get a reason for it.

## 1. General

- **TypeScript strict everywhere.** No `any`, no `@ts-ignore`, no non-null `!` except on TypeORM entity columns (definite assignment is how TypeORM entities are declared). Use `unknown` and narrow.
- **Names say what things are**, in the language of `GLOSSARY.md`. No abbreviations beyond `id`, `url`, `api`. Fix typos in names when you touch a file.
- **No dead code.** No commented-out code, unused exports, placeholder files or permissions nothing checks. If it isn't used, delete it.
- **Comments explain why, not what.** Prefer a better name over a comment.
- **Small units.** A function does one thing; a component renders one concept. Split when a file needs scrolling to understand.
- **Fail loudly at boundaries.** Validate every external input (HTTP body, query, env, API response used for control flow). Trust internal types after that.
- **No secrets in git.** `.env.example` holds placeholders; real values live in untracked `.env` files.

## 2. Git and pull requests

- Never commit directly to `main`.
- Branch names: `<type>/<kebab-scope>`, with type one of `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`. Example: `feat/findings-form`.
- Commits follow Conventional Commits with a scope: `feat(web): add severity badge`, `fix(api): scope refresh cookie to /api`. Imperative mood, under 72 characters in the subject.
- One concern per PR. The PR description says what changed, how it was verified, and its risk.
- CI (lint, typecheck, test, build) must be green before merge. Merge with a merge commit so the history stays readable.

## 3. Backend (`apps/api`)

- **Tenant isolation is non-negotiable.** Every query that reads or writes tenant data filters by the `orgId` taken from the verified access token, never from the request body, query or params. A record from another Organization is a `404`, not a `403`, so its existence is not leaked.
- **Every route declares its Permission** with `@RequirePermissions(...)`, or is explicitly `@Public()`. Authorisation is by Permission, never by comparing Role names.
- **DTOs validate everything** with `class-validator`; the global `ValidationPipe` uses `whitelist` and `forbidNonWhitelisted`.
- **Responses use response DTOs**, never raw entities, so internal columns cannot leak.
- **State changes write an Activity** in the same transaction as the change.
- **Errors go through the global exception filter** with a stable shape: `{ statusCode, message, errors? }`, where `errors` maps field names to messages for validation failures.
- Module layout: `modules/<name>/{controllers,services,dto,entities,enums}`. Cross-cutting code lives in `common/`.

## 4. Frontend (`apps/web`)

### Structure

```
src/
├── app/                 # routes only: layout, page, loading, error
├── features/<feature>/  # api/ components/ hooks/ schemas/ (create a folder only when it has a file)
├── components/ui/       # shadcn primitives, kept close to upstream
├── components/app-shell/ # sidebar, header, user menu, theme toggle
├── components/shared/   # our reusable components, each with a story
├── hooks/               # app-wide React hooks
└── lib/                 # api client, session, generic utilities
```

A feature may import from `components/`, `hooks/`, `lib/` and its own folder. Features do not import from each other; shared needs move to `components/shared` or `lib`.

### State (see ADR 0003 and 0006)

- Server data: **TanStack Query only**. Query keys come from one factory per feature (`findingKeys.list(filters)`). Mutations invalidate the keys they affect.
- Search, filters, sort and pagination: **the URL**. Read and write them through one typed hook per page.
- Client-only UI state stays with its owner: the sidebar in `SidebarProvider` (cookie-backed), the theme in `next-themes`, anything else local to its component. There is no global client store (ADR 0006).
- Never copy server data into `useState` or context.

### Data and types

- API types are **generated from the API's OpenAPI document** (`openapi-typescript`). Never hand-write a type the API already describes. After any API change run `pnpm api:contract` and commit `apps/api/openapi.json` and `apps/web/src/lib/api/schema.d.ts`; CI fails when they drift.
- Import API types from `lib/api/types.ts`, which names the schemas the app uses.
- All HTTP goes through the single API client in `lib/`; components never call `fetch` directly.
- The browser calls `/api/*` on its own origin; Next.js rewrites it to the API (ADR 0002).

### Roles and Permissions

- UI decisions use **Permissions from `/auth/me`**, through `<Can permission="finding:create">` or `useCan()` in client components and `hasPermissions(user, ...)` in Server Components. Never branch on Role names.
- Hiding a control is UX, not security; the API is the authority. Every hidden action is also rejected by the API, and a test proves it.

### Components

- Server Components by default; add `"use client"` only for interactivity or browser APIs.
- Every route segment that fetches has `loading.tsx` and `error.tsx`, and every list has an empty state.
- Forms use **react-hook-form + zod**. Schema limits mirror the API DTOs. Server validation errors are mapped back onto their fields.
- Styling uses Tailwind and the design tokens in `docs/design-system.md`. No hard-coded colours; both light and dark themes must work.
- `components/ui` holds unmodified shadcn primitives; change their look through tokens, and build variations in `components/shared`.

### Accessibility and responsiveness

- Semantic HTML first (`main`, `nav`, `header`, `table`, `button`); ARIA only when HTML cannot express it.
- Everything works with the keyboard, in a logical order, with a visible focus ring.
- Every input has a label; every icon-only button has an accessible name; errors are announced (`aria-live` / `aria-describedby`).
- Severity and status are never conveyed by colour alone; there is always text.
- Layouts work from 360px wide to desktop.

## 5. Testing

- Web: **Vitest + React Testing Library**, with **MSW** for HTTP. Test behaviour the user sees, queried by role and label, not implementation details.
- Each feature covers: rendering, user interaction, form validation, API error, loading state, role-based UI. Session expiry and filtering have their own tests.
- API: unit tests for guards and services; e2e tests for tenant isolation and Permission enforcement.
- A bug fix starts with a failing test.
- Every reusable component in `components/shared` has a Storybook story documenting its props and states.

## 6. Documentation

- Domain terms: `GLOSSARY.md`. Decisions: `docs/adr/`. Component props: `docs/components.md`.
- At the end of every work session, update `docs/HANDOFF.md`, add a row to `docs/time-report.md`, and record AI involvement in `AI_USAGE.md`.
- Docs, code, comments and commits are written in English.
