export const ACCESS_TOKEN_COOKIE = 'X-ACCESS';
export const REFRESH_TOKEN_COOKIE = 'X-REFRESH';

export const REFRESH_TOKEN_TTL_SECONDS = 14 * 24 * 60 * 60;

/** Every API route lives under this prefix, for direct and proxied calls alike. */
export const API_PREFIX = 'api';

/** The refresh cookie is only sent to the auth routes that need it: refresh and logout. */
export const REFRESH_TOKEN_COOKIE_PATH = `/${API_PREFIX}/auth`;
