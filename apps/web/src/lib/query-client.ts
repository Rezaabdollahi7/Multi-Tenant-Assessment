import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api/api-error";

const MAX_RETRIES = 2;

/** Client errors (4xx) will not succeed on retry; network and 5xx errors might. */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status < 500) return false;
  return failureCount < MAX_RETRIES;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: shouldRetry },
      mutations: { retry: false },
    },
  });
}
