# AI usage

How AI assistants were used to build this submission, as the brief asks. After the initial commit, every change reached `main` through a pull request that I reviewed and merged myself.

## Tools

| Tool                | Used for                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| DeepSeek V4 Pro     | Generating the first version of the backend (NestJS) code from my prompts.                                                 |
| Claude (chat)       | Planning, designing the RBAC model and the API contract, writing the prompts, explaining concepts.                         |
| Claude Code (agent) | From pull request #1 onwards: refactoring and hardening the API, the whole web app, tests, Storybook, CI, Docker and docs. |

An OpenCode configuration from an earlier setup was in the initial commit. It was removed in the first pull requests, and OpenCode was not used afterwards.

## Phase 1: the backend

I designed each part first: the Roles, the Permissions and the API contract. Then I generated the code from detailed prompts, and reviewed and checked the result.

**Code I wrote myself in the backend:** the base Auth module (request-otp, verify-otp, refresh, the cookies and the guards).

## Phase 2: Claude Code

From pull request #1 onwards, Claude Code worked in this repository under my direction. The rules it followed are in `CLAUDE.md` and `docs/RULES.md`.

- **One concern per branch and pull request.** It used Conventional Commits, and I merged each pull request after review. The history shows every step: the API hardening, then the web app milestone by milestone (#1–#21).
- **Decisions were mine and are recorded.** When a choice had a real trade-off, Claude Code proposed options and I decided. The decisions are recorded as ADRs (`docs/adr/`) and domain terms in `GLOSSARY.md`. Examples are removing Zustand (ADR 0006), making Persian the default language (ADR 0007), the Crextio-inspired visual direction and the Dana typeface.
- **Verified before every push.** Each pull request passed lint, typecheck, unit and component tests, the API e2e tests and the build in CI. The web app was also checked in a real browser: screenshots in both languages and themes, an axe accessibility audit and keyboard walks.
- **Agent skills.** The skills in `.claude/skills` (UI/UX, frontend design, domain modelling, code review, graphify and others) gave the agent consistent working methods. They are committed so the setup can be reproduced.

## What AI did not decide

- The scope, the Roles and the Permissions model.
- The design references, the default language and the typeface.
- What to merge.
- What to leave out, for example the time report (see `docs/limitations.md`).
