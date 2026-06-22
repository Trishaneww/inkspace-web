// Libs
import { SubscriptionStatus } from "@/types/subscription";
import { formatDate } from "./formatters";

export function planDescription(status: SubscriptionStatus): string {
  if (!status.isPremium) {
    return "You're on the Free plan with a 6% payment fee. Go Premium for AI features and a reduced 5% fee.";
  }

  const renewalDate = status.currentPeriodEnd
    ? formatDate(status.currentPeriodEnd)
    : null;

  if (status.cancelAtPeriodEnd) {
    return renewalDate
      ? `Premium ($19/month). Your plan ends on ${renewalDate}, then reverts to the free 6% fee.`
      : "Premium ($19/month). Your plan is set to cancel at the end of the current period.";
  }

  return renewalDate
    ? `Premium ($19/month) with a 5% payment fee. Renews on ${renewalDate}.`
    : "Premium ($19/month) with a 5% payment fee.";
}
