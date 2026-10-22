# The browser reaches the API through Next.js rewrites

The browser never calls the NestJS API directly. Next.js rewrites `/api/*` to the same path on the API, which serves every route under `/api`, so the session cookies are httpOnly, first-party to the web app, and need no CORS. `proxy.ts` redirects requests without a session away from protected routes, and Server Components load the current User and Permissions from `/auth/me` before rendering.

## Considered Options

- **Direct cross-origin calls with CORS and credentialed cookies**: more moving parts (CORS, `SameSite=None`, cookie domains) and harder to reason about in a security review.

## Consequences

Because the API itself lives under `/api`, cookie paths are the same whether a request comes through the web app or straight to the API.
