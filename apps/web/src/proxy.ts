import { NextResponse, type NextRequest } from "next/server";
import { routes } from "@/lib/routes";
import {
  ACCESS_TOKEN_COOKIE,
  isAccessTokenFresh,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/session/session-cookies";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

/**
 * First gate for every page: lets fresh sessions through, renews expiring ones
 * with the refresh cookie, and sends everyone else to sign-in (ADR 0005). The
 * protected layout and the API still verify the session; this only routes.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;
  if (pathname === routes.login()) return NextResponse.next();

  if (isAccessTokenFresh(request.cookies.get(ACCESS_TOKEN_COOKIE)?.value)) {
    return NextResponse.next();
  }

  const next = `${pathname}${search}`;
  if (!request.cookies.has(REFRESH_TOKEN_COOKIE)) {
    return redirectToSignIn(request, { next });
  }

  return (
    (await renewSession(request)) ??
    redirectToSignIn(request, { next, reason: "session_expired" })
  );
}

/**
 * Rotates the tokens and continues the request: the browser receives the new
 * cookies, and the page being rendered already sees them.
 */
async function renewSession(
  request: NextRequest,
): Promise<NextResponse | null> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    });
  } catch {
    return null;
  }
  if (!response.ok) return null;

  const setCookies = response.headers.getSetCookie();
  for (const setCookie of setCookies) {
    const [pair] = setCookie.split(";");
    const separator = pair.indexOf("=");
    request.cookies.set(pair.slice(0, separator), pair.slice(separator + 1));
  }

  const renewed = NextResponse.next({
    request: { headers: request.headers },
  });
  for (const setCookie of setCookies) {
    renewed.headers.append("set-cookie", setCookie);
  }
  return renewed;
}

function redirectToSignIn(
  request: NextRequest,
  params: Parameters<typeof routes.login>[0],
): NextResponse {
  const response = NextResponse.redirect(
    new URL(routes.login(params), request.url),
  );
  // Drop a refresh token the API has rejected, so the next visit starts clean.
  if (params?.reason === "session_expired") {
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
  }
  return response;
}

export const config = {
  // Pages only: not the /api proxy, Next internals, or files with an extension.
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
