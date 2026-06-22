// Types
import type { Client, ClientFilters } from "@/types/clients";

export function filterClients(
  clients: Client[],
  filters: ClientFilters,
): Client[] {
  const query = filters.search.trim().toLowerCase();
  const matched = query
    ? clients.filter((client) => matchesQuery(client, query))
    : clients;

  return [...matched].sort(comparatorFor(filters.sort));
}

export function hasActiveClientFilters(filters: ClientFilters): boolean {
  return filters.search.trim() !== "" || filters.sort !== "recent";
}

function matchesQuery(client: Client, query: string): boolean {
  return (
    client.name.toLowerCase().includes(query) ||
    client.email.toLowerCase().includes(query) ||
    (client.phone?.toLowerCase().includes(query) ?? false)
  );
}

function comparatorFor(
  sort: ClientFilters["sort"],
): (a: Client, b: Client) => number {
  switch (sort) {
    case "name":
      return (a, b) => a.name.localeCompare(b.name);
    case "bookings":
      return (a, b) => b.bookingsCount - a.bookingsCount;
    case "spend":
      return (a, b) => b.totalPaidCents - a.totalPaidCents;
    default:
      return (a, b) =>
        new Date(b.lastActivityAt).getTime() -
        new Date(a.lastActivityAt).getTime();
  }
}
