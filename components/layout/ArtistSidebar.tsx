"use client";

// Components
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

// Libs
import {
  artistMainNav,
  artistBusinessNav,
  artistWorkNav,
  artistOtherNav,
} from "@/lib/sidebar/sidebarConfig";

export const ArtistSidebar = () => (
  <DashboardSidebar
    navGroups={[
      { items: artistMainNav },
      { label: "Business", items: artistBusinessNav },
      { label: "Your Work", items: artistWorkNav },
      { label: "Other", items: artistOtherNav },
    ]}
    settingsHref="/dashboard/artist/settings"
    userMenu={{ subtitle: "Free", showUpgrade: true, subscriptionAware: true }}
  />
);
