import { ACCESS_TOKEN_COOKIE } from '@common/constants/jwt.constants';
import type { Request } from 'express';

function extractTokenFromCookie(request: Request): string | undefined {
  const cookies = request.cookies as Record<string, string> | undefined;
  return cookies?.[ACCESS_TOKEN_COOKIE];
}

function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

/** Browsers send the cookie; Swagger and API clients may send a Bearer header. */
export function extractToken(request: Request): string | undefined {
  return extractTokenFromCookie(request) ?? extractTokenFromHeader(request);
}
