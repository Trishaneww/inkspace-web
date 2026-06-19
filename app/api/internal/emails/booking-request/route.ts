// Next.js
import { NextResponse } from "next/server";

// Libs
import { authorizeInternalRequest } from "@/lib/api/internalEmail";
import { createResendClient } from "@/lib/clients/resend";
import { BookingRequestEmail } from "@/emails/BookingRequestEmail";

export const runtime = "nodejs";

interface BookingRequestEmailBody {
  to: string;
  clientName: string;
  artistName: string;
  durationMinutes: number;
  bookingUrl: string;
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
    subject: `Pick a time for your booking with ${body.artistName}`,
    react: BookingRequestEmail({
      clientName: body.clientName,
      artistName: body.artistName,
      durationMinutes: body.durationMinutes,
      bookingUrl: body.bookingUrl,
    }),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  return NextResponse.json({ sent: true });
}

const isValidBody = (body: unknown): body is BookingRequestEmailBody => {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.to === "string" &&
    typeof b.clientName === "string" &&
    typeof b.artistName === "string" &&
    typeof b.durationMinutes === "number" &&
    typeof b.bookingUrl === "string"
  );
};
