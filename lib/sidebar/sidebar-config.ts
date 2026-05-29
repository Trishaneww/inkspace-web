// HTML Components
import {
  BarChart3,
  BookOpenCheck,
  Calendar,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Settings,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";

export type IconType = React.ComponentType<{ className?: string }>;

export type NavLeaf = {
  href: string;
  label: string;
  icon: IconType;
  badge?: number;
};

export type NavChild = {
  href: string;
  label: string;
};

export type NavParent = {
  label: string;
  icon: IconType;
  basePath: string;
  children: NavChild[];
};

export type NavItem = NavLeaf | NavParent;

export const ARTIST_DASHBOARD_ROOT = "/dashboard/artist";

export const artistMainNav: NavItem[] = [
  {
    href: ARTIST_DASHBOARD_ROOT,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/artist/inbox",
    label: "Inbox",
    icon: Inbox,
    badge: 14,
  },
  {
    label: "Leads",
    icon: Target,
    basePath: "/dashboard/artist/leads",
    children: [
      { href: "/dashboard/artist/leads", label: "All Leads" },
      { href: "/dashboard/artist/leads/forms", label: "Forms" },
    ],
  },
  { href: "/dashboard/artist/calendar", label: "Calendar", icon: Calendar },
  {
    label: "Bookings",
    icon: BookOpenCheck,
    basePath: "/dashboard/artist/bookings",
    children: [
      { href: "/dashboard/artist/bookings", label: "All Bookings" },
      { href: "/dashboard/artist/bookings/payments", label: "Payments" },
      { href: "/dashboard/artist/bookings/open-book", label: "Open Book" },
    ],
  },
  { href: "/dashboard/artist/clients", label: "Clients", icon: Users },
  { href: "/dashboard/artist/portfolio", label: "Portfolio", icon: ImageIcon },
  { href: "/dashboard/artist/flashbook", label: "Flash", icon: Zap },
];

export const artistOtherNav: NavLeaf[] = [
  {
    href: "/dashboard/artist/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  { href: "/dashboard/artist/reviews", label: "Reviews", icon: Star },
];

export const artistSettingsNav: NavLeaf = {
  href: "/dashboard/artist/settings",
  label: "Settings",
  icon: Settings,
};
