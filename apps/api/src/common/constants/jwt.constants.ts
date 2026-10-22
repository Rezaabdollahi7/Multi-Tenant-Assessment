export const ACCESS_TOKEN_COOKIE = 'X-ACCESS';
export const REFRESH_TOKEN_COOKIE = 'X-REFRESH';

export const REFRESH_TOKEN_TTL_SECONDS = 14 * 24 * 60 * 60;

/** Every API route lives under this prefix, for direct and proxied calls alike. */
export const API_PREFIX = 'api';

/**
 * Site-wide, so the web app's proxy can renew a session during page navigation
 * (ADR 0005). It stays httpOnly and SameSite=Lax.
 */
export const REFRESH_TOKEN_COOKIE_PATH = '/';
