"use client";

// Next.js
import { useCallback, useEffect, useRef, useState } from "react";

// Libs
import { openGoogleCalendarPopup } from "@/lib/auth";
import { displayToast } from "@/lib/toast";
import { GOOGLE_CALENDAR_MESSAGE_TYPE } from "@/constants/auth";

interface GoogleCalendarResultMessage {
  type: typeof GOOGLE_CALENDAR_MESSAGE_TYPE;
  ok: boolean;
  email?: string;
  error?: string;
}

export interface GoogleCalendarConnect {
  connected: boolean;
  email: string | null;
  connecting: boolean;
  connect: () => void;
}

export const useGoogleCalendarConnect = (): GoogleCalendarConnect => {
  const [connected, setConnected] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const pollRef = useRef<number | null>(null);

  const stopPolling = () => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as GoogleCalendarResultMessage | null;
      if (!data || data.type !== GOOGLE_CALENDAR_MESSAGE_TYPE) return;

      stopPolling();
      setConnecting(false);
      if (data.ok) {
        setConnected(true);
        setEmail(data.email ?? null);
        displayToast(
          "Google Calendar connected",
          "success",
          "Your bookings will sync automatically.",
        );
      } else {
        displayToast(
          "Couldn't connect Google Calendar",
          "error",
          data.error ?? "Please try again.",
        );
      }
    };

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      stopPolling();
    };
  }, []);

  const connect = useCallback(() => {
    const popup = openGoogleCalendarPopup();
    if (!popup) {
      displayToast(
        "Google Calendar isn't available right now.",
        "error",
        "Calendar sync hasn't been configured. Please try again later.",
      );
      return;
    }

    setConnecting(true);
    stopPolling();
    pollRef.current = window.setInterval(() => {
      if (popup.closed) {
        stopPolling();
        setConnecting(false);
      }
    }, 600);
  }, []);

  return { connected, email, connecting, connect };
};
