# Handoff

The current state of the work, written for whoever picks it up next: a teammate, a reviewer, or a new AI session. Update it at the end of every work session; replace stale content rather than appending.

**Last updated:** 1405/07/30 (2026-10-22)
**Current milestone:** M0 · Decisions and repository hygiene (see `docs/ROADMAP.md`)

## Where things stand

- **API (`apps/api`):** functionally complete for the brief: OTP sign-in, JWT access and refresh cookies with rotation, three Roles mapped to Permissions, tenant scoping by `orgId`, dashboard, projects, members, findings CRUD, activities, seed for three Organizations. Not yet reviewed against `docs/RULES.md`; M1 lists the known fixes.
- **Web (`apps/web`):** clean slate. Leftover boilerplate from an earlier project was removed; what remains is shadcn primitives in `components/ui`, `cn` in `lib/utils`, `useIsMobile`, the neutral shadcn theme (light and dark tokens), an English LTR root layout and a placeholder home page. Lint, typecheck, tests and build pass. TanStack Query is not installed yet.
- **Infrastructure:** `docker/compose.yml` runs only Postgres and Redis. Web runs on :3000, the API on :3001.
- **Docs:** glossary, ADRs 0001–0004, rules, architecture and roadmap are written.
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

1. `ci/quality-gates`: GitHub Actions and Husky + lint-staged.
2. Start M1 (API hardening).

## Open issues and risks

- An OpenCode API key was committed in `opencode.json` in the initial commit. The repository is private; the file has been removed, but the key remains in git history and must be revoked by its owner.
- `typeorm.config.ts` uses `synchronize: true` instead of migrations. Acceptable for the assessment; listed as a limitation.
- The seed uses `Math.random()`, so data differs on every run until M1 makes it deterministic.

## How to resume

Read `CLAUDE.md`, then `docs/RULES.md`, then this file. Pick the first unchecked item in `docs/ROADMAP.md`, branch from `main`, and open a PR.
