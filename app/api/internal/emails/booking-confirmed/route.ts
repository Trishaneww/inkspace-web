// Next.js
import { NextResponse } from "next/server";

// Libs
import { authorizeInternalRequest } from "@/lib/api/internalEmail";
import { createResendClient } from "@/lib/clients/resend";
import { BookingConfirmedEmail } from "@/emails/BookingConfirmedEmail";

export const runtime = "nodejs";

interface BookingConfirmedEmailBody {
  to: string;
  clientName: string;
  artistName: string;
  whenLabel: string;
  durationMinutes: number;
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
    return NextResponse.json(
      { error: "email not configured" },
      { status: 500 },
    );
  }

  const { resend, from } = client;
  const { error } = await resend.emails.send({
    from,
    to: body.to,
    subject: `You're booked with ${body.artistName}`,
    react: BookingConfirmedEmail({
      clientName: body.clientName,
      artistName: body.artistName,
      whenLabel: body.whenLabel,
      durationMinutes: body.durationMinutes,
    }),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  return NextResponse.json({ sent: true });
}

const isValidBody = (body: unknown): body is BookingConfirmedEmailBody => {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.to === "string" &&
    typeof b.clientName === "string" &&
    typeof b.artistName === "string" &&
    typeof b.whenLabel === "string" &&
    typeof b.durationMinutes === "number"
  );
};
