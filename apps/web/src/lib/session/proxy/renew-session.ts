import type { NextRequest } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

export type RenewResult = { ok: true; setCookies: string[] } | { ok: false };

/**
 * با کوکی‌های فعلی درخواست، تلاش می‌کند نشست را از بک‌اند تازه کند.
 * خطای شبکه یا پاسخ غیر 2xx ⇒ ok:false (بدون throw).
 */
export async function renewSession(request: NextRequest): Promise<RenewResult> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    });
  } catch {
    return { ok: false };
  }

  if (!response.ok) return { ok: false };

  return { ok: true, setCookies: response.headers.getSetCookie() };
}
