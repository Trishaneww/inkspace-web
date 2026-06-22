"use client";

// Next.js
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Libs
import { clientInquiriesApi } from "@/lib/api/clientInquiries";
import { useAuth } from "@/lib/auth";

// Types
import type { ClientInquiry } from "@/types/bookings";

interface ClientBookingsValue {
  inquiries: ClientInquiry[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const ClientBookingsContext = createContext<ClientBookingsValue | null>(null);

export function ClientBookingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchKey = useRef<string | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!token) return;
      if (!silent) setIsLoading(true);
      setError(null);
      try {
        const data = await clientInquiriesApi.list(token);
        setInquiries(data.inquiries);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load your bookings",
        );
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [token],
  );

  const refresh = useCallback(() => load(true), [load]);

  useEffect(() => {
    if (lastFetchKey.current === token) return;
    lastFetchKey.current = token;
    queueMicrotask(() => load(false));
  }, [load, token]);

  return (
    <ClientBookingsContext.Provider
      value={{ inquiries, isLoading, error, refresh }}
    >
      {children}
    </ClientBookingsContext.Provider>
  );
}

export function useClientBookings(): ClientBookingsValue {
  const value = useContext(ClientBookingsContext);
  if (!value) {
    throw new Error(
      "useClientBookings must be used within a ClientBookingsProvider",
    );
  }
  return value;
}
