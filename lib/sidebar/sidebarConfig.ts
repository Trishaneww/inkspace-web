// HTML Components
import {
  BarChart3,
  BookOpenCheck,
  Calendar,
  Home,
  Image as ImageIcon,
  Inbox,
  Receipt,
  Settings,
  Star,
  Users,
  Zap,
} from "lucide-react";

// Libs
import { ARTIST_DASHBOARD_ROOT } from "@/constants/flashes";

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

export const artistMainNav: NavLeaf[] = [
  {
    href: ARTIST_DASHBOARD_ROOT,
    label: "Home",
    icon: Home,
  },
  {
    href: "/dashboard/artist/bookings",
    label: "Bookings",
    icon: BookOpenCheck,
  },
  {
    href: "/dashboard/artist/invoices",
    label: "Invoices",
    icon: Receipt,
  },
  {
    href: "/dashboard/artist/clients",
    label: "Clients",
    icon: Users,
  },
  {
    href: "/dashboard/artist/calendar",
    label: "Calendar",
    icon: Calendar,
  },
];

export const artistWorkNav: NavLeaf[] = [
  { href: "/dashboard/artist/flashbook", label: "Flashbook", icon: Zap },
  { href: "/dashboard/artist/portfolio", label: "Portfolio", icon: ImageIcon },
];

export const artistOtherNav: NavLeaf[] = [
  {
    href: "/dashboard/artist/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  { href: "/dashboard/artist/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/artist/settings", label: "Settings", icon: Settings },
];

export const clientNav: NavLeaf[] = [
  {
    href: "/dashboard/client/bookings",
    label: "Bookings & inquiries",
    icon: BookOpenCheck,
  },
  { href: "/dashboard/client/messages", label: "Messages", icon: Inbox },
];
