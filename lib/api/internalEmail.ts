// Next.js
import { NextResponse } from "next/server";

export function authorizeInternalRequest(
  request: Request,
): NextResponse | null {
  const secret = process.env.INTERNAL_EMAIL_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "email not configured" },
      { status: 500 },
    );
  }
  if (request.headers.get("x-internal-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return null;
}
