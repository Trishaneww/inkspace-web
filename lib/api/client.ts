// Libs
import { captureApiFailure } from "@/lib/sentryLogs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    captureApiFailure({ url, method, status: 0, cause: err });
    throw new ApiError("Network error. Please try again.", 0);
  }

  if (!res.ok) {
    const payload = await res
      .json()
      .catch(() => ({}) as Record<string, unknown>);
    const errBody = (payload as { error?: { message?: string } }).error;
    const message =
      errBody?.message ??
      (payload as { message?: string }).message ??
      res.statusText ??
      "Request failed";
    const fieldErrors = (payload as { fieldErrors?: Record<string, string> })
      .fieldErrors;

    if (res.status >= 500) {
      captureApiFailure({
        url,
        method,
        status: res.status,
        body: payload,
      });
    }

    throw new ApiError(message, res.status, fieldErrors);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, token?: string) =>
    request<T>(path, { method: "GET", token }),

  post: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, { method: "POST", body, token }),

  put: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, { method: "PUT", body, token }),

  patch: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, { method: "PATCH", body, token }),

  delete: <T>(path: string, token?: string) =>
    request<T>(path, { method: "DELETE", token }),
};
