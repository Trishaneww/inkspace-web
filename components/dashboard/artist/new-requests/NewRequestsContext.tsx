"use client";

// Next.js
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Hooks
import { useSubscription } from "@/hooks/useSubscription";

// Libs
import { useAuth } from "@/lib/auth";
import { bookingsApi } from "@/lib/api/bookings";
import { buildNewRequestsList } from "@/lib/dashboard/newRequests";
import type { Inquiry } from "@/types/bookings";
import type { SubscriptionStatus } from "@/types/subscription";

interface NewRequestsContextValue {
  status: SubscriptionStatus | null;
  isSubscriptionLoading: boolean;
  inquiries: Inquiry[] | null;
  newRequests: Inquiry[];
  count: number;
  markActed: (inquiryId: string) => void;
}

const NewRequestsContext = createContext<NewRequestsContextValue | null>(null);

export const NewRequestsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = useAuth();
  const { status, isLoading: isSubscriptionLoading } = useSubscription();

  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [actedIds, setActedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!token || (status && !status.isPremium)) return;
    let active = true;
    bookingsApi
      .list(token)
      .then((res) => {
        if (active) setInquiries(res.inquiries);
      })
      .catch(() => {
        if (active) setInquiries([]);
      });
    return () => {
      active = false;
    };
  }, [token, status]);

  const markActed = (inquiryId: string) =>
    setActedIds((prev) => new Set(prev).add(inquiryId));

  const newRequests = useMemo(
    () => buildNewRequestsList(inquiries ?? [], actedIds),
    [inquiries, actedIds],
  );

  const value = useMemo(
    () => ({
      status,
      isSubscriptionLoading,
      inquiries,
      newRequests,
      count: newRequests.length,
      markActed,
    }),
    [status, isSubscriptionLoading, inquiries, newRequests],
  );

  return (
    <NewRequestsContext.Provider value={value}>
      {children}
    </NewRequestsContext.Provider>
  );
};

export const useNewRequests = () => {
  const context = useContext(NewRequestsContext);
  if (!context) {
    throw new Error("useNewRequests must be used within a NewRequestsProvider");
  }
  return context;
};
