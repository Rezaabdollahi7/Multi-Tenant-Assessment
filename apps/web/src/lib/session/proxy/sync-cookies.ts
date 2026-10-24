import { NextResponse, type NextRequest } from "next/server";

/**
 * هر set-cookie را به دو جا منتقل می‌کند:
 *  - request.cookies تا هندلرهای بعدی مقدار تازه را ببینند
 *  - هدر پاسخ تا مرورگر کوکی را ذخیره کند
 */
export function syncSetCookies(
  request: NextRequest,
  setCookies: string[],
): NextResponse {
  for (const setCookie of setCookies) {
    const [pair] = setCookie.split(";");
    const separator = pair.indexOf("=");
    if (separator === -1) continue;
    request.cookies.set(pair.slice(0, separator), pair.slice(separator + 1));
  }

  const response = NextResponse.next({ request: { headers: request.headers } });
  for (const setCookie of setCookies) {
    response.headers.append("set-cookie", setCookie);
  }
  return response;
}
