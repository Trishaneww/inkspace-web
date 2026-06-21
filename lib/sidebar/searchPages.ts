// HTML Components
import {
  Repeat,
  BookOpenCheck,
  Calendar,
  Home,
  Image as ImageIcon,
  Inbox,
  MessageSquare,
  Settings,
  Star,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";

// Libs
import type { IconType } from "@/lib/sidebar/sidebarConfig";

export interface SearchPage {
  label: string;
  href: string;
  breadcrumb: string[];
  icon: IconType;
  keywords?: string[];
}

export const ARTIST_SEARCH_PAGES: SearchPage[] = [
  { label: "Home", href: "/dashboard/artist", breadcrumb: [], icon: Home },
  {
    label: "Bookings",
    href: "/dashboard/artist/bookings",
    breadcrumb: [],
    icon: BookOpenCheck,
  },
  {
    label: "Open book",
    href: "/dashboard/artist/bookings/",
    breadcrumb: ["Bookings"],
    icon: BookOpenCheck,
    keywords: ["availability", "requests"],
  },
  {
    label: "Transactions",
    href: "/dashboard/artist/transactions",
    breadcrumb: [],
    icon: Repeat,
    keywords: ["earnings", "deposits", "invoices", "payouts", "income"],
  },
  {
    label: "Calendar",
    href: "/dashboard/artist/calendar",
    breadcrumb: [],
    icon: Calendar,
    keywords: ["schedule", "bookings"],
  },
  {
    label: "Clients",
    href: "/dashboard/artist/clients",
    breadcrumb: [],
    icon: Users,
  },
  {
    label: "Messages",
    href: "/dashboard/artist/messages",
    breadcrumb: [],
    icon: Inbox,
    keywords: ["inbox", "chat"],
  },
  {
    label: "Inquiries",
    href: "/dashboard/artist/bookings",
    breadcrumb: [],
    icon: MessageSquare,
  },
  {
    label: "Leads",
    href: "/dashboard/artist/bookings",
    breadcrumb: [],
    icon: UserPlus,
  },
  {
    label: "Flashbook",
    href: "/dashboard/artist/flashbook",
    breadcrumb: [],
    icon: Zap,
    keywords: ["flash", "designs"],
  },
  {
    label: "Portfolio",
    href: "/dashboard/artist/portfolio",
    breadcrumb: [],
    icon: ImageIcon,
  },
  {
    label: "Reviews",
    href: "/dashboard/artist/reviews",
    breadcrumb: [],
    icon: Star,
  },
  {
    label: "Settings",
    href: "/dashboard/artist/settings",
    breadcrumb: [],
    icon: Settings,
    keywords: ["account", "preferences"],
  },
];

export function filterSearchPages(query: string): SearchPage[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return ARTIST_SEARCH_PAGES;

  return ARTIST_SEARCH_PAGES.filter((page) => {
    const haystack = [page.label, ...page.breadcrumb, ...(page.keywords ?? [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(trimmed);
  });
}
