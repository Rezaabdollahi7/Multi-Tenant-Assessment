# Handoff

The current state of the work, written for whoever picks it up next: a teammate, a reviewer, or a new AI session. Update it at the end of every work session; replace stale content rather than appending.

**Last updated:** 1405/07/30 (2026-10-22)
**Current milestone:** M2 · Web foundation, app shell left; M3-A (authentication UI) done (see `docs/ROADMAP.md`)

## Where things stand

- **API (`apps/api`):** reviewed and hardened (PR `refactor/api-hardening`). All routes under `/api`, typed response DTOs on every route, strict TypeScript, env validated at startup, OTP state in Redis, deterministic seed, 10 unit and 15 e2e tests (e2e run in CI against Postgres and Redis). `apps/api/README.md` documents the security model and routes.
- **Web (`apps/web`):** typed API client generated from the API contract (`pnpm api:contract`), TanStack Query, design system (`docs/design-system.md`), and the session: `proxy.ts` guard with silent renewal, protected `(app)` layout, sign-in page (phone → code, demo accounts), sign-out, `SessionProvider` / `useCan` / `<Can>`. The dashboard is a placeholder and the header is temporary until the app shell lands. 34 tests (Vitest + RTL + MSW).
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

1. Merge in order: #8 (typed API client), #9 (design system), then the session PR.
2. App shell: responsive sidebar navigation, header with User menu and theme toggle (replaces the temporary header in `app/(app)/layout.tsx`).
3. M3-B dashboard.

## Open issues and risks

- An OpenCode API key was committed in `opencode.json` in the initial commit. The repository is private; the file has been removed, but the key remains in git history and must be revoked by its owner.
- `typeorm.config.ts` uses `synchronize: true` instead of migrations. Acceptable for the assessment; listed as a limitation.

## How to resume

Read `CLAUDE.md`, then `docs/RULES.md`, then this file. Pick the first unchecked item in `docs/ROADMAP.md`, branch from `main`, and open a PR.
