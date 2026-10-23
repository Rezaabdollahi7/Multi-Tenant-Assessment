# Handoff

The current state of the work, written for whoever picks it up next: a teammate, a reviewer, or a new AI session. Update it at the end of every work session; replace stale content rather than appending.

**Last updated:** 1405/08/01 (2026-10-23)
**Current milestone:** M4 · Findings next; M0–M3 and M4-C (Projects) done (see `docs/ROADMAP.md`)

## Where things stand

- **API (`apps/api`):** reviewed and hardened (PR `refactor/api-hardening`). All routes under `/api`, typed response DTOs on every route, strict TypeScript, env validated at startup, OTP state in Redis, deterministic seed, 10 unit and 15 e2e tests (e2e run in CI against Postgres and Redis). `apps/api/README.md` documents the security model and routes.
- **Web (`apps/web`):** typed API client generated from the API contract (`pnpm api:contract`), TanStack Query, design system (`docs/design-system.md`), and the session: `proxy.ts` guard with silent renewal, protected `(app)` layout, sign-in page (phone → code, demo accounts), sign-out, `SessionProvider` / `useCan` / `<Can>`. App shell in `components/app-shell` (sidebar, header, User menu, theme toggle, skip link). Dashboard (`features/dashboard`): headline counts, Severity and Project Status breakdowns, 30-day Finding trend (Recharts, with a text summary and a screen-reader table), recent Activity; each panel has its own loading, empty and error-with-retry state. Projects (`features/projects`): list with debounced search, Project Status filter and pagination, all kept in the URL through `hooks/use-list-params.ts` and a zod schema that repairs hand-edited URLs; Project details rendered on the server with `loading`, `error` and `not-found` (also for other Organizations' Projects), Severity breakdown and Members. Shared so far: `StatCard`, `BreakdownList`, `Panel`, `DataTable`, `SearchInput`, `FilterSelect`, `Pagination`, `StatusBadge`, `EmptyState`, `ErrorState` in `components/shared`; Severity, status and Role labels in `lib/`; date and count formatting in `lib/format.ts`. The Findings page is a placeholder. 60 tests (Vitest + RTL + MSW).
- **Infrastructure:** `docker compose -f docker/compose.yml up --build` runs Postgres, Redis, the API (seeds on first start, health-checked at `/api/health`) and the web app (Next.js standalone) with no configuration. Web on :3000, API on :3001. The web app rewrites `/api/*` to the API, baked in at build time from `API_URL`.
- **Docs:** glossary, ADRs 0001–0004, rules, architecture and roadmap are written.
- **Quality gates:** CI runs format check, lint, typecheck, unit tests and build on every PR and on `main`. A Husky pre-commit hook runs lint-staged (ESLint and Prettier on staged files). pnpm is pinned to 11.25.0.
- **Tooling:** Claude Code is the only AI assistant; all agent skills live in `.agents/skills` and are linked into `.claude/skills`.

## Decisions made so far

All recorded in `docs/adr/` and `GLOSSARY.md`. In short:

- The NestJS API is the brief's Mock API; MSW only in tests and Storybook.
- The browser reaches the API through Next.js rewrites; session cookies are httpOnly and first-party.
- State: URL for filters, TanStack Query for server data, Zustand for UI-only state.
- Every User sees every Project in their Organization; membership is informational.
- UI in English, left-to-right, light and dark themes. Docs and code in English.
- Project Status becomes Planned / In Progress / Completed / Archived; Finding Status `ACCEPTED` is shown as Risk Accepted; `member:manage` is removed.
- Finding forms are separate pages, built with react-hook-form + zod; API types are generated with `openapi-typescript`.

## Next steps

1. Merge the Projects PR.
2. M4-D Findings: list with search and Severity / Finding Status / Project filters (reuse `useListParams`, `DataTable`, `FilterSelect`; honour `?projectId=` from Project details), `SeverityBadge`, details, create and edit pages, delete for Admins. Then embed the Project's Findings on the Project details page.
3. Finding mutations must invalidate the Dashboard's queries too (`["dashboard"]`); features may not import each other, so move the shared key root to `lib/` when M4 needs it.

## Open issues and risks

- An OpenCode API key was committed in `opencode.json` in the initial commit. The repository is private; the file has been removed, but the key remains in git history and must be revoked by its owner.
- The trend chart is a single series on purpose: the five Severity colours fail the colour-blind separation check as a stacked chart, so the per-day Severity split is in the tooltip and the screen-reader table instead.
- Filter and search changes use `router.replace`, so typing does not flood the browser history; pagination links push, so Back returns to the previous page.
- Two decisions wait on the project owner: whether to keep Zustand (nothing needs it yet; recommended: drop it and update ADR 0003), and the hours worked so far for `docs/time-report.md`.
- `typeorm.config.ts` uses `synchronize: true` instead of migrations. Acceptable for the assessment; listed as a limitation.

## How to resume

Read `CLAUDE.md`, then `docs/RULES.md`, then this file. Pick the first unchecked item in `docs/ROADMAP.md`, branch from `main`, and open a PR.
