/** Cookie names set by the API (apps/api/src/common/constants/jwt.constants.ts). */
export const ACCESS_TOKEN_COOKIE = "X-ACCESS";
export const REFRESH_TOKEN_COOKIE = "X-REFRESH";

/** Renew this long before expiry, so a page never renders with a token about to lapse. */
const EXPIRY_MARGIN_MS = 30_000;

/**
 * Whether an access token is present and not about to expire. It only reads the
 * `exp` claim; the API verifies the signature on every request.
 */
export function isAccessTokenFresh(
  token: string | undefined,
  now = Date.now(),
): boolean {
  const payload = token?.split(".")[1];
  if (!payload) return false;

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(base64)) as { exp?: unknown };
    return typeof exp === "number" && exp * 1000 - now > EXPIRY_MARGIN_MS;
  } catch {
    return false;
  }
}
