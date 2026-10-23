import type { ApiErrorBody } from "@/assets/types/api";

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string[]>;

  constructor(status: number, body: unknown) {
    const { message, errors } = (body ?? {}) as ApiErrorBody;
    super(message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = errors ?? {};
  }
}

type FetchResult = { data?: unknown; error?: unknown; response: Response };

export async function unwrap<R extends FetchResult>(
  result: Promise<R>,
): Promise<Exclude<R["data"], undefined>> {
  const { data, error, response } = await result;
  if (error !== undefined || !response.ok) {
    throw new ApiError(response.status, error);
  }
  return data as Exclude<R["data"], undefined>;
}

export function errorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "ارتباط با سرور برقرار نشد. اتصال خود را بررسی کنید و دوباره تلاش کنید.";
  }
  if (error.status === 403) return "نقش شما مجوز این کار را ندارد.";
  if (error.status === 404) return "وجود ندارد یا دیگر در دسترس نیست.";
  if (error.status === 429) {
    return "تلاش‌ها بیش از حد مجاز بود. چند دقیقه صبر کنید و دوباره تلاش کنید.";
  }
  if (error.status >= 500)
    return "سرور با مشکل روبه‌رو شد. کمی بعد دوباره تلاش کنید.";
  return "مشکلی پیش آمد. دوباره تلاش کنید.";
}

export type Settled<T> = { ok: true; data: T } | { ok: false; error: unknown };

export function settle<T>(promise: Promise<T>): Promise<Settled<T>> {
  return promise.then(
    (data) => ({ ok: true, data }),
    (error: unknown) => ({ ok: false, error }),
  );
}
