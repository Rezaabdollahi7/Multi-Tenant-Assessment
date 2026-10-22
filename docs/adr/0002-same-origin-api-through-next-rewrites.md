# The browser reaches the API through Next.js rewrites

The browser never calls the NestJS API directly. Next.js rewrites `/api/*` to the API, so the session cookies are httpOnly, first-party to the web app, and need no CORS. `proxy.ts` redirects requests without a session away from protected routes, and Server Components load the current User and Permissions from `/auth/me` before rendering.

## Considered Options

- **Direct cross-origin calls with CORS and credentialed cookies**: more moving parts (CORS, `SameSite=None`, cookie domains) and harder to reason about in a security review.

## Consequences

Cookie paths set by the API must match the path the browser sees (for example the refresh cookie must be scoped to `/api/auth/refresh`, not `/auth/refresh`).
