import { NextResponse, type NextRequest } from "next/server";
import { routes } from "@/lib/routes";
import {
  ACCESS_TOKEN_COOKIE,
  isAccessTokenFresh,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/session/session-cookies";
import { renewSession } from "@/lib/session/proxy/renew-session";
import { syncSetCookies } from "@/lib/session/proxy/sync-cookies";
import { redirectToSignIn } from "@/lib/session/proxy/redirect-to-sign-in";

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

  const renewal = await renewSession(request);
  if (renewal.ok) {
    return syncSetCookies(request, renewal.setCookies);
  }

  return redirectToSignIn(request, { next, reason: "session_expired" });
}

export const config = {
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
