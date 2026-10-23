# Known limitations

What this submission does not do, or does in a simplified way, and why. Each item is a deliberate trade-off for an assessment with a fixed deadline, not an oversight. Items marked _production_ would need work before real use.

## Authentication and security

- **No SMS provider.** The one-time code is never sent. Outside production (`NODE_ENV` not `production`), every code is `DEV_OTP` (`00000` by default), and the API returns it in the response so the demo works without a phone. In production the API generates a random code, stores its hash and sends it nowhere, so nobody can sign in until a provider is wired into `AuthService.requestOtp`. _production_
- **Rate limiting covers sign-in only.** OTP requests (3 per 2 minutes) and failed verifications (5) are limited per phone number in Redis. Other routes have no request throttling. _production_
- **Demo accounts are listed on the sign-in page** in development and when `DEMO_MODE=true`, which the Docker stack sets. That is a convenience for reviewers; real deployments leave it off.
- **Cookies are `SameSite=Lax`, with no separate CSRF token.** Every state-changing request is same-origin `fetch` with JSON, which a cross-site form cannot send. A deployment that serves the API from another site would need a CSRF token.

## Data

- **Schema by `synchronize: true`.** TypeORM creates the tables from the entities on start; there are no migrations. Fine for seeded demo data, not for data that must survive schema changes. _production_
- **Fabricated data only.** Three Organizations with five Projects each, seeded deterministically (`pnpm --filter api seed`). There is no screen to create Organizations, Users or Projects, and none to manage Project Members (`member:manage` was removed from the brief's Permission list). The API and seed are the only way to change them.
- **Every User sees every Project of their Organization.** Project membership is shown but grants nothing (ADR 0004).
- **No Finding history.** Activity records who created, edited or deleted a Finding, but not the previous values.

## Interface

- **API messages are English.** The UI shows its own localized message for each HTTP status, so only an API field-validation message, placed on its field, can appear in English inside the Persian UI.
- **The Finding form lists at most 100 Projects**, the API's largest page. Seeded Organizations have five.
- **The Finding trend is a single series.** A stacked chart by Severity would need five colours that fail the colour-blind separation check, so the per-day Severity split is in the tooltip and in the screen-reader table instead.
- **The interface is not translated by URL.** The language is a cookie (ADR 0007), so a link always opens in the reader's own language and search engines see one language per page. That suits a signed-in tool, not a public site.
- **Dana is a commercial typeface** (fontiran.com), committed under the project owner's licence. Anyone reusing the code needs their own licence or another font.

## Testing

- **No end-to-end browser tests of the web app in CI.** The web app has 80 unit and component tests (Vitest + React Testing Library + MSW) and 34 Storybook stories run in Chromium with accessibility checks. The API has unit tests and e2e tests against Postgres and Redis. Whole-app flows (sign-in, Role-aware pages, the axe audit of every page) were checked with Playwright scripts during development but are not part of CI.
- **Story `play` functions use the Persian labels**, the default language. Run under English, they fail while the stories themselves still render; the axe check passes in both languages.

## Delivery

- **No time report.** Brief deliverable 10 is left out by the project owner's decision.
