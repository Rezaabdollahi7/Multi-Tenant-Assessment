# Roadmap

Brief `MB-BE-01`, started **1405/07/25 (2026-10-17)**, due **1405/08/05 (2026-10-27)**: ten calendar days.

Each milestone is delivered as one or more pull requests into `main`. Tick items only when they are merged.

## M0 · Decisions and repository hygiene: 1405/07/30 (Oct 22)

- [x] Read the brief; settle open decisions (grilling session)
- [x] `GLOSSARY.md`, ADRs 0001–0004
- [x] `CLAUDE.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/HANDOFF.md`, `docs/RULES.md`
- [ ] Remove OpenCode (`opencode.json`, `.opencode/`, `AGENTS.md`); link all agent skills into `.claude/skills`
- [ ] Replace secrets in `.env.example` files with placeholders
- [ ] CI on GitHub Actions: lint, typecheck, test, build
- [ ] Husky + lint-staged pre-commit (Prettier, ESLint)

## M1 · API hardening: 1405/08/01 (Oct 23)

- [ ] Rename `vrify-otp` → `verify-otp`; fix misspelt files (`rolse.guard`, `role.contants`)
- [ ] Scope the refresh cookie to `/api/auth/refresh` (ADR 0002)
- [ ] Project Status `ACTIVE` → `PLANNED`; Finding Status `ACCEPTED` labelled Risk Accepted
- [ ] Remove the unused `member:manage` Permission and the Role-name guard if nothing needs it
- [ ] Enable full `strict` in `apps/api`; fix resulting errors
- [ ] Access-token lifetime configurable through env
- [ ] Deterministic seed (fixed random seed) so screenshots and tests are reproducible
- [ ] Docker Compose runs the whole stack (postgres, redis, api + seed, web) with one command; web on :3000, api on :3001
- [ ] Review AI-generated services for tenant scoping, `404` on foreign records, and Activity writes
- [ ] e2e tests: tenant isolation, Permission enforcement, refresh rotation

## M2 · Web foundation: 1405/08/01–02 (Oct 23–24)

- [ ] Restructure `apps/web/src` to `app / features / components / lib`; delete placeholder files; fix shadcn aliases
- [ ] Generated API types (`openapi-typescript`) and a typed API client with refresh-and-retry
- [ ] Next.js rewrites `/api/*`; `proxy.ts` route guard; protected layout loading `/auth/me`
- [ ] TanStack Query provider, query-key factories; Zustand UI store
- [ ] `Can` / `useCan` from `/auth/me` Permissions
- [ ] App shell: responsive sidebar, header with User menu, theme toggle (light / dark / system)
- [ ] MSW handlers shared by tests and Storybook

## M3 · Authentication UI and Dashboard: 1405/08/02 (Oct 24)

- [ ] **A.** Login (phone → code), logout, signed-in state in the header, auth error messages, redirect to protected routes and back via `next`, session-expired message
- [ ] **B.** Dashboard: Project count, Finding count, Severity breakdown, Project Status breakdown, 30-day Finding trend chart, latest Activities

## M4 · Projects and Findings: 1405/08/03 (Oct 25)

- [ ] **C.** Projects list with search, Project Status filter, pagination; Project details with Members and its Findings; loading, empty, error states
- [ ] **D.** Findings list with search and Severity / Finding Status / Project filters; Severity badge; Finding details; create and edit pages (title, description, Severity, Finding Status) with validation errors; delete with confirmation (Admin)
- [ ] **E.** Every action gated by Permission in the UI and rejected by the API

## M5 · Quality: 1405/08/04 (Oct 26)

- [ ] **F.** ≥ 5 reusable components in `components/shared`, each with stories and documented props
- [ ] **G.** ≥ 10 meaningful tests covering rendering, interaction, form validation, API error, loading, role-based UI, session expiry, filtering, component behaviour
- [ ] **H.** Responsive 360px → desktop; keyboard navigation; semantic HTML; visible focus; Storybook a11y addon clean
- [ ] Optional, only if time remains: Playwright smoke tests (sign in as each Role)

## M6 · Delivery: 1405/08/05 (Oct 27)

- [ ] `docs/components.md`: component documentation
- [ ] `docs/screenshots/`: every main page, light and dark, desktop and mobile
- [ ] `docs/time-report.md`: time spent
- [ ] `docs/limitations.md`: known limitations and issues
- [ ] `AI_USAGE.md`: how AI assistants were used, in English
- [ ] Fresh-clone run-through of `README.md` on a clean machine
- [ ] Final review against the checklist below

## Brief checklist

| Brief item                                                                                                                                                 | Milestone    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Next.js App Router, React + TypeScript strict, Tailwind, shadcn/ui                                                                                         | M2           |
| Zustand (with rationale), TanStack Query for server state                                                                                                  | M2, ADR 0003 |
| Vitest + React Testing Library                                                                                                                             | M5           |
| Storybook for main components                                                                                                                              | M5           |
| A. Authentication UI, server-enforced session                                                                                                              | M1, M3       |
| B. Dashboard                                                                                                                                               | M3           |
| C. Assessment (Project) management                                                                                                                         | M4           |
| D. Findings management                                                                                                                                     | M4           |
| E. Role-aware interface, API rejects unauthorised requests                                                                                                 | M1, M4       |
| F. Component architecture                                                                                                                                  | M5           |
| G. Testing                                                                                                                                                 | M5           |
| H. Responsive and accessibility                                                                                                                            | M5           |
| Deliverables 1–11 (private repo, source, README, architecture, Mock API and data, component docs, Storybook, tests, screenshots, time report, limitations) | M0–M6        |
