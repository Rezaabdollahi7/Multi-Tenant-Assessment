# API

The NestJS API behind the dashboard, and the brief's Mock API: its data is fabricated by a seed script ([ADR 0001](../../docs/adr/0001-nestjs-backend-as-mock-api.md)). System-level design lives in [`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md).

Every route is served under `/api`. The OpenAPI document and Swagger UI are at `http://localhost:3001/docs`.

## Security model

- **Sign-in:** phone number + 5-digit one-time code. Codes are stored bcrypt-hashed in Redis for 2 minutes. Each phone may request 3 codes per 2 minutes and make 5 wrong attempts before a 5-minute lock; both limits answer `429`. An unknown phone gets the same answer as a wrong code.
- **Session:** a short-lived access JWT (`ACCESS_TOKEN_TTL_SECONDS`, default 15 minutes) and a 14-day refresh JWT, both in `httpOnly`, `SameSite=Lax` cookies (`Secure` in production). Both cookies are site-wide so the web app can renew a session while navigating ([ADR 0005](../../docs/adr/0005-session-renewal-in-the-web-proxy.md)).
- **Refresh rotation:** refresh tokens are stored as SHA-256 hashes and rotated on every use. Presenting an already-rotated token revokes its whole family. Logout revokes the current token.
- **Authorisation:** each route declares the Permission it needs with `@RequirePermissions`; Roles map to Permissions in [`permissions.constants.ts`](src/common/constants/permissions.constants.ts). Routes without a session answer `401`, missing Permissions `403`.
- **Tenant isolation:** `orgId` comes only from the verified access token. Records of another Organization answer `404`, so their existence is not disclosed.
- **Hardening:** environment validated at startup, `helmet` headers, whitelist validation that rejects unknown fields, a global exception filter that never leaks stack traces.

## Setup

Requires Postgres and Redis; `docker compose -f ../../docker/compose.yml up -d postgres redis` starts both.

```bash
cp .env.example .env
pnpm install
pnpm seed          # reset the database and fabricate data
pnpm dev           # watch mode on :3001
```

`pnpm seed --if-empty` seeds only an empty database. The seed is deterministic: the same data on every run, with dates relative to today.

## Demo accounts

Outside production every code is `DEV_OTP` (default `00000`), and `request-otp` also returns it.

| Organization | Admin       | Analyst     | Viewer      |
| ------------ | ----------- | ----------- | ----------- |
| Org A        | 09911110001 | 09911110002 | 09911110003 |
| Org B        | 09922220001 | 09922220002 | 09922220003 |
| Org C        | 09933330001 | 09933330002 | 09933330003 |

## Routes

| Method | Path                                                                                     | Permission                    |
| ------ | ---------------------------------------------------------------------------------------- | ----------------------------- |
| POST   | `/api/auth/request-otp`, `/api/auth/verify-otp`, `/api/auth/refresh`, `/api/auth/logout` | public                        |
| GET    | `/api/auth/me`                                                                           | signed in                     |
| GET    | `/api/dashboard/summary`, `/api/dashboard/trend`                                         | `dashboard:read`              |
| GET    | `/api/dashboard/activities`                                                              | `activity:read`               |
| GET    | `/api/projects`, `/api/projects/:id`                                                     | `project:read`                |
| GET    | `/api/projects/:id/members`                                                              | `project:read`, `member:read` |
| GET    | `/api/findings`, `/api/findings/:id`                                                     | `finding:read`                |
| POST   | `/api/findings`                                                                          | `finding:create`              |
| PATCH  | `/api/findings/:id`                                                                      | `finding:update`              |
| DELETE | `/api/findings/:id`                                                                      | `finding:delete`              |

Lists accept `page`, `limit`, `search` and their filters, and return `{ data, meta: { page, limit, totalItems, totalPages } }`.

## Tests

```bash
pnpm test          # unit tests
pnpm test:e2e      # e2e against the Postgres and Redis in .env
pnpm lint
pnpm check-types
```

The e2e suites create their own Organizations and remove them afterwards, so they can run against a seeded database.
