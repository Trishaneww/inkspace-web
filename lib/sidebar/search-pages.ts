// HTML Components
import {
  BarChart3,
  BookOpenCheck,
  Calendar,
  CreditCard,
  FileText,
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
import type { IconType } from "@/lib/sidebar/sidebar-config";

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
    href: "/dashboard/artist/bookings/open-book",
    breadcrumb: ["Bookings"],
    icon: BookOpenCheck,
    keywords: ["availability", "requests"],
  },
  {
    label: "Payments",
    href: "/dashboard/artist/bookings/payments",
    breadcrumb: ["Bookings"],
    icon: CreditCard,
    keywords: ["deposits", "invoices"],
  },
  {
    label: "Calendar",
    href: "/dashboard/artist/calendar",
    breadcrumb: [],
    icon: Calendar,
    keywords: ["schedule", "appointments"],
  },
  {
    label: "Clients",
    href: "/dashboard/artist/clients",
    breadcrumb: [],
    icon: Users,
  },
  {
    label: "Inbox",
    href: "/dashboard/artist/inbox",
    breadcrumb: [],
    icon: Inbox,
    keywords: ["messages", "chat"],
  },
  {
    label: "Inquiries",
    href: "/dashboard/artist/inquiries",
    breadcrumb: [],
    icon: MessageSquare,
  },
  {
    label: "Leads",
    href: "/dashboard/artist/leads",
    breadcrumb: [],
    icon: UserPlus,
  },
  {
    label: "Forms",
    href: "/dashboard/artist/leads/forms",
    breadcrumb: ["Leads"],
    icon: FileText,
    keywords: ["intake"],
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
    label: "Analytics",
    href: "/dashboard/artist/analytics",
    breadcrumb: [],
    icon: BarChart3,
    keywords: ["stats", "insights"],
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
