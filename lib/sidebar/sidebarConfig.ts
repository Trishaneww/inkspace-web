// HTML Components
import {
  BookOpenCheck,
  Calendar,
  Home,
  Image as ImageIcon,
  Inbox,
  Settings,
  Star,
  Users,
  Wallet,
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
    href: "/dashboard/artist/calendar",
    label: "Calendar",
    icon: Calendar,
  },
  {
    href: "/dashboard/artist/clients",
    label: "Clients",
    icon: Users,
  },
  {
    href: "/dashboard/artist/messages",
    label: "Messages",
    icon: Inbox,
  },
];

export const artistBusinessNav: NavLeaf[] = [
  {
    href: "/dashboard/artist/earnings",
    label: "Earnings",
    icon: Wallet,
  },
  {
    href: "/dashboard/artist/reviews",
    label: "Reviews",
    icon: Star,
  },
];

export const artistWorkNav: NavLeaf[] = [
  { href: "/dashboard/artist/flashbook", label: "Flashbook", icon: Zap },
  { href: "/dashboard/artist/portfolio", label: "Portfolio", icon: ImageIcon },
];

export const artistOtherNav: NavLeaf[] = [
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
