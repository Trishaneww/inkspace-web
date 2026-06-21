"use client";

// Components
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

// Libs
import { clientNav } from "@/lib/sidebar/sidebarConfig";
import { useClientBookings } from "@/lib/clientBookingsContext";
import { needsClientAction } from "@/lib/clientInquiries";

const BOOKINGS_HREF = "/dashboard/client/bookings";

export const ClientSidebar = () => {
  const { inquiries } = useClientBookings();
  const actionCount = inquiries.filter(needsClientAction).length;

  const items = clientNav.map((item) =>
    item.href === BOOKINGS_HREF && actionCount > 0
      ? { ...item, badge: actionCount }
      : item,
  );

  return (
    <DashboardSidebar
      navGroups={[{ items }]}
      settingsHref={BOOKINGS_HREF}
      userMenu={{ subtitle: "Client", showUpgrade: false }}
    />
  );
};
