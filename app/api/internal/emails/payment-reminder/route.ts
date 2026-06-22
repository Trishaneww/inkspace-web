// Next.js
import { NextResponse } from "next/server";

// Libs
import { authorizeInternalRequest } from "@/lib/api/internalEmail";
import { createResendClient } from "@/lib/clients/resend";
import { PaymentReminderEmail } from "@/emails/PaymentReminderEmail";

export const runtime = "nodejs";

interface PaymentReminderEmailBody {
  to: string;
  clientName: string;
  artistName: string;
  amountCents: number;
  currency: string;
  payUrl: string;
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
    subject: `Reminder: your payment to ${body.artistName}`,
    react: PaymentReminderEmail({
      clientName: body.clientName,
      artistName: body.artistName,
      amountCents: body.amountCents,
      currency: body.currency,
      payUrl: body.payUrl,
    }),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  return NextResponse.json({ sent: true });
}

const isValidBody = (body: unknown): body is PaymentReminderEmailBody => {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.to === "string" &&
    typeof b.clientName === "string" &&
    typeof b.artistName === "string" &&
    typeof b.amountCents === "number" &&
    typeof b.currency === "string" &&
    typeof b.payUrl === "string"
  );
};
