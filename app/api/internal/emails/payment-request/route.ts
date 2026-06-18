// Next.js
import { NextResponse } from "next/server";

// Libs
import { authorizeInternalRequest } from "@/lib/api/internalEmail";
import { createResendClient } from "@/lib/clients/resend";
import { PaymentRequestEmail } from "@/emails/PaymentRequestEmail";
import type { PaymentType } from "@/types/bookings";

export const runtime = "nodejs";

interface PaymentRequestEmailBody {
  to: string;
  clientName: string;
  artistName: string;
  type: PaymentType;
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

  const subject =
    body.type === "deposit"
      ? `Your deposit request from ${body.artistName}`
      : `Your payment request from ${body.artistName}`;

  const { resend, from } = client;
  const { error } = await resend.emails.send({
    from,
    to: body.to,
    subject,
    react: PaymentRequestEmail({
      clientName: body.clientName,
      artistName: body.artistName,
      type: body.type,
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

const isValidBody = (body: unknown): body is PaymentRequestEmailBody => {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.to === "string" &&
    typeof b.clientName === "string" &&
    typeof b.artistName === "string" &&
    (b.type === "deposit" || b.type === "final") &&
    typeof b.amountCents === "number" &&
    typeof b.currency === "string" &&
    typeof b.payUrl === "string"
  );
};
