// Libs
import * as Sentry from "@sentry/nextjs";

interface ApiFailureContext {
  url: string;
  method: string;
  status: number;
  body?: unknown;
  cause?: unknown;
}

export function captureApiFailure({
  url,
  method,
  status,
  body,
  cause,
}: ApiFailureContext) {
  Sentry.captureException(
    cause ?? new Error(`API ${method} ${url} failed with status ${status}`),
    {
      tags: { area: "api", status: String(status) },
      extra: { url, method, status, body },
    },
  );
}
