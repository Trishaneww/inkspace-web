// Libs
import type { Inquiry } from "@/types/bookings";

export const buildNewRequestsList = (
  inquiries: Inquiry[],
  actedIds: Set<string>,
) =>
  inquiries
    .filter(
      (inquiry) =>
        inquiry.status === "pending" &&
        !inquiry.artistReplied &&
        !actedIds.has(inquiry.id),
    )
    .sort(compareByValueThenRecency);

const compareByValueThenRecency = (a: Inquiry, b: Inquiry) => {
  const aValue = a.ai.valueCents ?? -1;
  const bValue = b.ai.valueCents ?? -1;
  if (aValue !== bValue) return bValue - aValue;
  return b.createdAt.localeCompare(a.createdAt);
};
