// Libs
import { type NavItem, type NavParent } from "@/lib/sidebar/sidebarConfig";
import { ARTIST_DASHBOARD_ROOT } from "@/constants/flashes";
import type { User } from "@/types/index";

export function checkIsParent(item: NavItem): item is NavParent {
  return "children" in item;
}

export function checkIsLeafActive(pathname: string, href: string): boolean {
  if (href === ARTIST_DASHBOARD_ROOT) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function checkIsParentActive(
  pathname: string,
  basePath: string,
): boolean {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

export function checkIsExactPathActive(
  pathname: string,
  href: string,
): boolean {
  return pathname === href;
}

export function getUserInitial(user: User | null): string {
  if (!user) return "?";

  const source = user.firstName || user.email || "?";
  return source.charAt(0).toUpperCase();
}

export function getDisplayName(user: User | null): string {
  if (!user) return "";

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return fullName || user.email;
}
