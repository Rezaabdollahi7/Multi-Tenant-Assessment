# Sessions are renewed in the web app's proxy, so the refresh cookie is site-wide

The access token lives 15 minutes; the refresh token 14 days. When a User returns after the access token expired, the first thing they do is navigate to a page, which only Next.js's `proxy.ts` sees before anything renders. To renew the session there, the proxy must receive the refresh cookie, so the cookie's path is `/` rather than `/api/auth`. The proxy calls the API's refresh route, forwards the rotated cookies to the browser and to the page being rendered, and only redirects to sign-in when renewal fails. In the browser, the API client renews on a `401` the same way.

## Considered Options

- **Refresh cookie scoped to `/api/auth`**: it reaches fewer routes, but a page navigation after expiry could not be renewed server-side; every such visit would render a sign-in redirect or a client-side renewal flash.

## Consequences

The refresh token is sent with every request to the web origin. It stays `httpOnly`, `SameSite=Lax` and `Secure` in production, is rotated on every use, and reuse revokes its whole family, so its wider path does not let scripts or other sites use it.
