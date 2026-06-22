export interface SubscriptionStatus {
  status: string;
  isPremium: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
}
