# Secure Multi-Tenant Assessment Dashboard

A hiring assessment (brief `MB-BE-01`) delivered on **1405/08/05 (2026-10-27)**. Code quality is judged as much as features: every change must be clean, deliberate, and defensible in an interview.

## Read before working

- @docs/RULES.md: how code is written, tested and committed here. Binding.
- @GLOSSARY.md: domain language. Use these terms in code, UI and docs; never the _Avoid_ words.
- @docs/HANDOFF.md: where the last session stopped and what comes next.
- `docs/ARCHITECTURE.md`: system design. `docs/ROADMAP.md`: milestones and the brief's checklist. `docs/adr/`: decisions already made; don't reopen one without a new ADR.

## Repository

pnpm + Turborepo monorepo.

- `apps/api`: NestJS 11, TypeORM, Postgres, Redis. Swagger at `http://localhost:3001/docs`.
- `apps/web`: Next.js 16 App Router, React 19, Tailwind 4, shadcn/ui, TanStack Query, Vitest, Storybook.
- `packages/eslint-config`, `packages/typescript-config`: shared configs.
- `docker/compose.yml`: local infrastructure.

## Commands

Run from the repo root unless noted.

```bash
pnpm install
pnpm dev                            # api + web via turbo
pnpm lint && pnpm check-types       # must pass before every commit
pnpm --filter frontend test         # web unit/component tests (Vitest)
pnpm --filter api test              # api unit tests (Jest)
pnpm --filter api seed              # reseed fabricated data
pnpm api:contract                   # after any API change: regenerate openapi.json and web types
pnpm --filter frontend storybook    # component catalogue on :6006
```

## Working agreement

- Never commit to `main`. Branch as `<type>/<kebab-scope>` (`feat/findings-list`, `fix/session-refresh`), open a PR, merge with a merge commit.
- Conventional Commits with a scope: `feat(web): ...`, `fix(api): ...`, `docs: ...`.
- At the end of a work session, update `docs/HANDOFF.md` and `AI_USAGE.md`.
- New domain term or changed meaning → update `GLOSSARY.md` in the same PR. Hard-to-reverse decision with a real trade-off → add an ADR.
- No secrets in the repo. `.env.example` files hold placeholders only.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
