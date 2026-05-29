"use client";

// Next.js
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// CSS
import styles from "@/styles/ArtistSidebar.module.css";

// HTML Components
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import InkspaceLogo from "@/public/logos/inkspace-logo.svg";
import {
  ChevronDown,
  HelpCircle,
  LogOut,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";

// Libs
import { useAuth } from "@/lib/auth";
import {
  artistMainNav,
  artistOtherNav,
  artistSettingsNav,
  type NavLeaf,
  type NavParent,
} from "@/lib/sidebar/sidebar-config";
import {
  getDisplayName,
  checkIsExactPathActive,
  checkIsLeafActive,
  checkIsParent,
  checkIsParentActive,
  getUserInitial,
} from "@/lib/sidebar/utils";

export const ArtistSidebar = () => {
  const pathname = usePathname() ?? "";

  return (
    <Sidebar collapsible="icon" className={styles.sidebarRoot}>
      <SidebarHeader>
        <div className={styles.brandRow}>
          <InkspaceLogo className={styles.brandLogo} aria-hidden />
          <span className={styles.brandName}>Inkspace</span>
        </div>
        <div className={styles.headerRow}>
          <span className={styles.sectionLabel}>Main</span>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {artistMainNav.map((item) =>
                checkIsParent(item) ? (
                  <ParentNavItem
                    key={item.label}
                    item={item}
                    pathname={pathname}
                  />
                ) : (
                  <LeafNavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                  />
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {artistOtherNav.map((item) => (
                <LeafNavItem key={item.href} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <LeafNavItem item={artistSettingsNav} pathname={pathname} />
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help & Support">
              <HelpCircle />
              <span>Help & Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <div className={styles.aiAssistRow}>
          <Sparkles className={styles.aiIcon} />
          <span className={styles.aiLabel}>AI Assist</span>
          <Switch defaultChecked size="sm" />
        </div>
        <UserMenu />
        <div className={styles.copyright}>© 2026 Inkspace Inc.</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

interface LeafNavItemProps {
  item: NavLeaf;
  pathname: string;
}

const LeafNavItem = ({ item, pathname }: LeafNavItemProps) => {
  const active = checkIsLeafActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.label}
        isActive={active}
        render={<Link href={item.href} />}
      >
        <Icon />
        <span>{item.label}</span>
      </SidebarMenuButton>
      {item.badge !== undefined && (
        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
};

interface ParentNavItemProps {
  item: NavParent;
  pathname: string;
}

const ParentNavItem = ({ item, pathname }: ParentNavItemProps) => {
  const parentActive = checkIsParentActive(pathname, item.basePath);
  const [open, setOpen] = useState(parentActive);
  const [wasParentActive, setWasParentActive] = useState(parentActive);
  const Icon = item.icon;

  // Auto-expand when navigation lands on a child route; manual collapse still works.
  if (parentActive !== wasParentActive) {
    setWasParentActive(parentActive);
    if (parentActive) setOpen(true);
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={styles.parentItem}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton tooltip={item.label} isActive={parentActive}>
              <Icon />
              <span>{item.label}</span>
              <ChevronDown className={styles.chevron} />
            </SidebarMenuButton>
          }
        />
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((child) => (
              <SidebarMenuSubItem key={child.href}>
                <SidebarMenuSubButton
                  isActive={checkIsExactPathActive(pathname, child.href)}
                  render={<Link href={child.href} />}
                >
                  <span>{child.label}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const UserMenu = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (!user) return null;
  const name = getDisplayName(user);

  return (
    <div className={styles.userCard}>
      <div className={styles.userInitial} aria-hidden>
        {getUserInitial(user)}
      </div>
      <div className={styles.userInfo}>
        <div className={styles.userName}>{name}</div>
        <div className={styles.userSubtitle}>Pro</div>
      </div>

      <Popover>
        <PopoverTrigger className={styles.moreButton} aria-label="Account menu">
          <MoreHorizontal className={styles.moreIcon} />
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          sideOffset={8}
          className={styles.userPopover}
        >
          <div className={styles.popoverHeader}>
            <div className={styles.popoverName}>{name}</div>
            <div className={styles.popoverEmail}>{user.email}</div>
            <button type="button" className={styles.upgradeButton}>
              <Sparkles className={styles.upgradeIcon} />
              <span>Upgrade to Pro+</span>
            </button>
          </div>

          <div className={styles.popoverDivider} />

          <button
            type="button"
            className={styles.popoverItem}
            onClick={handleLogout}
          >
            <LogOut className={styles.popoverItemIcon} />
            <span>Log out</span>
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
