"use client";

// Next.js
import { useEffect, useMemo, useState } from "react";

// Libs
import { startOfMonth } from "date-fns";
import { useAuth } from "@/lib/auth";
import { calendarApi } from "@/lib/api/calendar";
import { getCalendarRange, shiftAnchor } from "@/lib/calendar";

// Types
import type { CalendarEvent, CalendarView } from "@/types/calendar";

export const useCalendar = (isMobile: boolean) => {
  const { token } = useAuth();

  const [view, setView] = useState<CalendarView>("week");
  const [anchor, setAnchor] = useState<Date>(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(() => new Date());

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const effectiveView: CalendarView = isMobile ? "month" : view;

  const range = useMemo(
    () => getCalendarRange(effectiveView, anchor),
    [effectiveView, anchor],
  );
  const fromISO = range.start.toISOString();
  const toISO = range.end.toISOString();

  useEffect(() => {
    if (!token) return;
    let active = true;

    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await calendarApi.list(token, fromISO, toISO);
        if (active) setEvents(res.events);
      } catch {
        if (active) setError("Couldn't load your calendar.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadEvents();
    return () => {
      active = false;
    };
  }, [token, fromISO, toISO, reloadKey]);

  const refresh = () => setReloadKey((key) => key + 1);

  const navigate = (direction: 1 | -1) => {
    const next = shiftAnchor(effectiveView, anchor, direction);
    setAnchor(next);
    if (isMobile) setSelectedDay(startOfMonth(next));
  };
  const goPrev = () => navigate(-1);
  const goNext = () => navigate(1);
  const goToday = () => {
    const now = new Date();
    setAnchor(now);
    setSelectedDay(now);
  };

  const openDay = (day: Date) => {
    setAnchor(day);
    setView("day");
  };

  return {
    view,
    effectiveView,
    setView,
    anchor,
    selectedDay,
    setSelectedDay,
    events,
    loading,
    error,
    goPrev,
    goNext,
    goToday,
    openDay,
    refresh,
  };
};
