import "server-only";
import createClient from "openapi-fetch";
import { cookies } from "next/headers";
import type { paths } from "@/assets/types/api-schema";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";

export async function serverApi() {
  const cookieHeader = (await cookies()).toString();
  return createClient<paths>({
    baseUrl: BASE_URL,
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });
}
