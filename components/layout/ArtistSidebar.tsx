"use client";

// Components
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

// Hooks
import { useNewRequests } from "@/components/dashboard/artist/new-requests/NewRequestsContext";
import { useMessaging } from "@/components/dashboard/messaging/MessagingContext";

// Libs
import {
  artistMainNav,
  artistBusinessNav,
  artistWorkNav,
  artistOtherNav,
  NEW_REQUESTS_HREF,
  MESSAGES_HREF,
} from "@/lib/sidebar/sidebarConfig";

export const ArtistSidebar = () => {
  const { count: newRequestsCount } = useNewRequests();
  const { unreadCount } = useMessaging();

  const navBadges: Record<string, number> = {
    [NEW_REQUESTS_HREF]: newRequestsCount,
    [MESSAGES_HREF]: unreadCount,
  };
  const mainNav = artistMainNav.map((item) =>
    navBadges[item.href] ? { ...item, badge: navBadges[item.href] } : item,
  );

  return (
    <DashboardSidebar
      navGroups={[
        { items: mainNav },
        { label: "Business", items: artistBusinessNav },
        { label: "Your Work", items: artistWorkNav },
        { label: "Other", items: artistOtherNav },
      ]}
      settingsHref="/dashboard/artist/settings"
      userMenu={{ subtitle: "Free", showUpgrade: true, subscriptionAware: true }}
    />
  );
};
