/** The error body every API failure returns (see apps/api global exception filter). */
type ErrorBody = {
  statusCode?: number;
  message?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  readonly status: number;
  /** Validation messages per field, present on 400 responses. */
  readonly fieldErrors: Record<string, string[]>;

  constructor(status: number, body: unknown) {
    const { message, errors } = (body ?? {}) as ErrorBody;
    super(message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = errors ?? {};
  }
}

type ApiResult<T> =
  | { data: T; error?: never; response: Response }
  | { data?: never; error: unknown; response: Response };

/** Returns the data of an openapi-fetch result, or throws an ApiError. */
export async function unwrap<T>(result: Promise<ApiResult<T>>): Promise<T> {
  const { data, error, response } = await result;
  if (error !== undefined || !response.ok) {
    throw new ApiError(response.status, error);
  }
  return data as T;
}
