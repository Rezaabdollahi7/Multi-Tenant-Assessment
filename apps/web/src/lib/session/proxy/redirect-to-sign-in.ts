import { NextResponse, type NextRequest } from "next/server";
import { routes } from "@/lib/routes";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/session/session-cookies";

type SignInParams = Parameters<typeof routes.login>[0];

export function redirectToSignIn(
  request: NextRequest,
  params: SignInParams,
): NextResponse {
  const response = NextResponse.redirect(
    new URL(routes.login(params), request.url),
  );

  if (params?.reason === "session_expired") {
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
  }

  return response;
}
