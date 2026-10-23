export const ACCESS_TOKEN_COOKIE = "X-ACCESS";
export const REFRESH_TOKEN_COOKIE = "X-REFRESH";

const EXPIRY_MARGIN_MS = 30_000;

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
