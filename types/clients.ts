export interface Client {
  email: string;
  name: string;
  phone?: string;
  bookingsCount: number;
  lastActivityAt: string;
  totalPaidCents: number;
  currency: string;
  completedSessions: number;
  lastSessionAt?: string;
  hasUpcoming: boolean;
}

export type ClientSortOrder = "recent" | "name" | "bookings" | "spend";

export interface ClientFilters {
  search: string;
  sort: ClientSortOrder;
}
