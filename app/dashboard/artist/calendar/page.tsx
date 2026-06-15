"use client";

// Next.js
import { useState } from "react";

// CSS
import styles from "@/styles/dashboard/artist/Calendar.module.css";

// Components
import { CalendarHeader } from "@/components/dashboard/artist/calendar/CalendarHeader";
import { CalendarTimeGrid } from "@/components/dashboard/artist/calendar/CalendarTimeGrid";
import { CalendarMonthView } from "@/components/dashboard/artist/calendar/CalendarMonthView";
import { CalendarMobileView } from "@/components/dashboard/artist/calendar/CalendarMobileView";
import { CreateAppointmentSheet } from "@/components/dashboard/artist/calendar/create/CreateAppointmentSheet";
import { InquiryDetailSheet } from "@/components/dashboard/artist/bookings/InquiryDetailSheet";

// Hooks
import { useIsMobile } from "@/hooks/useMobile";
import { useCalendar } from "@/hooks/useCalendar";

// Libs
import { formatViewTitle, getViewDays } from "@/lib/calendar";
import type { CalendarTypeFilter } from "@/constants/calendar";

export default function ArtistCalendarPage() {
  const isMobile = useIsMobile();
  const calendar = useCalendar(isMobile);

  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    null,
  );
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<CalendarTypeFilter>("all");

  const title = formatViewTitle(calendar.effectiveView, calendar.anchor);

  const visibleEvents =
    typeFilter === "all"
      ? calendar.events
      : calendar.events.filter((event) => event.type === typeFilter);

  return (
    <div className={styles.page}>
      <CalendarHeader
        title={title}
        view={calendar.view}
        showViewToggle={!isMobile}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        onViewChange={calendar.setView}
        onPrev={calendar.goPrev}
        onNext={calendar.goNext}
        onNewAppointment={() => setIsCreateAppointmentOpen(true)}
      />

      {calendar.error && (
        <div className={styles.errorBanner}>{calendar.error}</div>
      )}

      {isMobile ? (
        <CalendarMobileView
          anchor={calendar.anchor}
          events={visibleEvents}
          selectedDay={calendar.selectedDay}
          onSelectDay={calendar.setSelectedDay}
          onSelectEvent={setSelectedInquiryId}
          onNewAppointment={() => setIsCreateAppointmentOpen(true)}
        />
      ) : calendar.view === "month" ? (
        <CalendarMonthView
          anchor={calendar.anchor}
          events={visibleEvents}
          onSelectDay={calendar.openDay}
          onSelectEvent={setSelectedInquiryId}
        />
      ) : (
        <CalendarTimeGrid
          days={getViewDays(calendar.view, calendar.anchor)}
          events={visibleEvents}
          onSelectEvent={setSelectedInquiryId}
        />
      )}

      <InquiryDetailSheet
        inquiryId={selectedInquiryId}
        onClose={() => setSelectedInquiryId(null)}
        onActed={calendar.refresh}
      />

      <CreateAppointmentSheet
        open={isCreateAppointmentOpen}
        onOpenChange={setIsCreateAppointmentOpen}
        onCreated={() => {
          setIsCreateAppointmentOpen(false);
          calendar.refresh();
        }}
      />
    </div>
  );
}
