"use client";

// Components
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

// Libs
import { clientNav } from "@/lib/sidebar/sidebarConfig";

export const ClientSidebar = () => (
  <DashboardSidebar
    navGroups={[{ items: clientNav }]}
    settingsHref="/dashboard/client/bookings"
    userMenu={{ subtitle: "Client", showUpgrade: false }}
  />
);
