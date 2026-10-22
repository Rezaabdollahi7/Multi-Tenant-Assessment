import "server-only";
import createClient from "openapi-fetch";
import { cookies } from "next/headers";
import type { paths } from "./schema";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

/**
 * An API client for Server Components and route handlers. It calls the API
 * directly and forwards the incoming request's cookies, so the API applies the
 * signed-in User's Organization and Permissions.
 */
export async function serverApi() {
  const cookieHeader = (await cookies()).toString();
  return createClient<paths>({
    baseUrl: API_URL,
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });
}
