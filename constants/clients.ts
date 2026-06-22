// Types
import type { ClientFilters, ClientSortOrder } from "@/types/clients";
import type { FilterOption } from "@/types/filters";

export const EMPTY_CLIENT_FILTERS: ClientFilters = {
  search: "",
  sort: "recent",
};

export const CLIENT_SORT_OPTIONS: FilterOption<ClientSortOrder>[] = [
  { value: "recent", label: "Recent activity" },
  { value: "name", label: "Name (A-Z)" },
  { value: "bookings", label: "Most bookings" },
  { value: "spend", label: "Top spenders" },
];
