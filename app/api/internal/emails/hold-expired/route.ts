// Next.js
import { NextResponse } from "next/server";

// Libs
import { authorizeInternalRequest } from "@/lib/api/internalEmail";
import { createResendClient } from "@/lib/clients/resend";
import {
  HoldExpiredEmail,
  type HoldExpiredAudience,
} from "@/emails/HoldExpiredEmail";

export const runtime = "nodejs";

interface HoldExpiredEmailBody {
  to: string;
  audience: HoldExpiredAudience;
  clientName: string;
  artistName: string;
}

export async function POST(request: Request) {
  const unauthorized = authorizeInternalRequest(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  if (!isValidBody(body)) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const client = createResendClient();
  if (!client) {
    return NextResponse.json({ error: "email not configured" }, { status: 500 });
  }

  const subject =
    body.audience === "client"
      ? `Your held time with ${body.artistName} was released`
      : `${body.clientName}'s held session was released`;

  const { resend, from } = client;
  const { error } = await resend.emails.send({
    from,
    to: body.to,
    subject,
    react: HoldExpiredEmail({
      audience: body.audience,
      clientName: body.clientName,
      artistName: body.artistName,
    }),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  return NextResponse.json({ sent: true });
}

const isValidBody = (body: unknown): body is HoldExpiredEmailBody => {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.to === "string" &&
    (b.audience === "client" || b.audience === "artist") &&
    typeof b.clientName === "string" &&
    typeof b.artistName === "string"
  );
};
