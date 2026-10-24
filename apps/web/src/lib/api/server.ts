import "server-only";
import createClient from "openapi-fetch";
import { cookies } from "next/headers";
import type { paths } from "@/assets/types/api-schema";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

export async function serverApi() {
  const cookieHeader = (await cookies()).toString();
  return createClient<paths>({
    baseUrl: API_URL,
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });
}
