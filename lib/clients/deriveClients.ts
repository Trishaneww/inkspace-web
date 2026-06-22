// Types
import type { Appointment, Inquiry } from "@/types/bookings";
import type { Client } from "@/types/clients";

export function deriveClients(inquiries: Inquiry[]): Client[] {
  const byEmail = new Map<string, Inquiry[]>();
  for (const inquiry of inquiries) {
    const key = inquiry.clientEmail.trim().toLowerCase();
    if (!key) continue;
    const group = byEmail.get(key);
    if (group) group.push(inquiry);
    else byEmail.set(key, [inquiry]);
  }

  return Array.from(byEmail.values()).map(buildClient);
}

function buildClient(group: Inquiry[]): Client {
  const ordered = [...group].sort(byNewest);
  const latest = ordered[0];
  const withPhone = ordered.find((inquiry) => inquiry.clientPhone?.trim());
  const paidPayments = group.flatMap((inquiry) =>
    inquiry.payments.filter((payment) => payment.status === "paid"),
  );

  const appointments = collectAppointments(group);
  const completedSessions = appointments.filter(
    (appt) => appt.type === "session" && appt.status === "completed",
  );
  const lastSessionAt = completedSessions
    .map((appt) => appt.scheduledStart)
    .filter((start): start is string => Boolean(start))
    .sort()
    .at(-1);
  const hasUpcoming = appointments.some(
    (appt) =>
      appt.status === "scheduled" &&
      appt.scheduledStart != null &&
      new Date(appt.scheduledStart).getTime() > Date.now(),
  );

  return {
    email: latest.clientEmail,
    name: latest.clientName,
    phone: withPhone?.clientPhone,
    bookingsCount: group.length,
    lastActivityAt: latest.createdAt,
    totalPaidCents: paidPayments.reduce(
      (total, payment) => total + payment.clientChargeCents,
      0,
    ),
    currency: paidPayments[0]?.currency ?? "CAD",
    completedSessions: completedSessions.length,
    lastSessionAt,
    hasUpcoming,
  };
}

function collectAppointments(group: Inquiry[]): Appointment[] {
  const byId = new Map<string, Appointment>();
  for (const inquiry of group) {
    const all = [inquiry.appointment, ...(inquiry.liveAppointments ?? [])];
    for (const appt of all) {
      if (appt) byId.set(appt.id, appt);
    }
  }
  return Array.from(byId.values());
}

function byNewest(a: Inquiry, b: Inquiry): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}
