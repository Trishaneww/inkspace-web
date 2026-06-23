// Next.js
import { NextResponse } from "next/server";

// Libs
import { authorizeInternalRequest } from "@/lib/api/internalEmail";
import { createResendClient } from "@/lib/clients/resend";
import { NewMessageEmail } from "@/emails/NewMessageEmail";

export const runtime = "nodejs";

interface NewMessageEmailBody {
  to: string;
  audience: string;
  recipientName: string;
  senderName: string;
  artistName: string;
  url: string;
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

  const { resend, from } = client;
  const { error } = await resend.emails.send({
    from,
    to: body.to,
    subject: `New message from ${body.senderName}`,
    react: NewMessageEmail({
      recipientName: body.recipientName,
      senderName: body.senderName,
      artistName: body.artistName,
      url: body.url,
    }),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  return NextResponse.json({ sent: true });
}

const isValidBody = (body: unknown): body is NewMessageEmailBody => {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.to === "string" &&
    typeof b.audience === "string" &&
    typeof b.recipientName === "string" &&
    typeof b.senderName === "string" &&
    typeof b.artistName === "string" &&
    typeof b.url === "string"
  );
};
