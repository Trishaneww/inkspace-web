"use client";

// Next.js
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

// CSS
import styles from "@/styles/DashboardSidebar.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import InkspaceLogo from "@/public/logos/inkspace-logo.svg";
import {
  CircleHelp,
  LogOut,
  MoreHorizontal,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

// Libs
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/hooks/useSubscription";
import { subscriptionApi } from "@/lib/api/subscription";
import { ApiError } from "@/lib/api/client";
import { displayToast } from "@/lib/toast";
import { type NavLeaf } from "@/lib/sidebar/sidebarConfig";
import {
  getDisplayName,
  checkIsLeafActive,
  getUserInitial,
} from "@/lib/sidebar/utils";

export interface SidebarNavGroup {
  label?: string;
  items: NavLeaf[];
}

export interface SidebarUserMenu {
  subtitle: string;
  showUpgrade: boolean;
  subscriptionAware?: boolean;
}

interface DashboardSidebarProps {
  navGroups: SidebarNavGroup[];
  settingsHref: string;
  userMenu: SidebarUserMenu;
}

export const DashboardSidebar = ({
  navGroups,
  settingsHref,
  userMenu,
}: DashboardSidebarProps) => {
  const pathname = usePathname() ?? "";
  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" className={styles.sidebarRoot}>
      <SidebarHeader>
        {isMobile ? (
          <MobileHeader settingsHref={settingsHref} />
        ) : (
          <div className={styles.brandRow}>
            <InkspaceLogo className={styles.brandLogo} aria-hidden />
            <span className={styles.brandName}>Inkspace</span>
            <SidebarTrigger className={styles.brandTrigger} />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group, index) => (
          <SidebarGroup key={group.label ?? index}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <LeafNavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <UserMenu userMenu={userMenu} />
        <div className={styles.copyright}>© 2026 Inkspace Inc.</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

const MobileHeader = ({ settingsHref }: { settingsHref: string }) => {
  const { setOpenMobile } = useSidebar();

  return (
    <>
      <div className={styles.mobileHeaderBar}>
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={() => setOpenMobile(false)}
          aria-label="Close menu"
        >
          <X className={styles.mobileHeaderIcon} />
        </Button>
        <div className={styles.mobileHeaderActions}>
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="Settings"
            nativeButton={false}
            render={
              <Link href={settingsHref} onClick={() => setOpenMobile(false)} />
            }
          >
            <Settings className={styles.mobileHeaderIcon} />
          </Button>
          <Button variant="ghost" size="icon-lg" aria-label="Help">
            <CircleHelp className={styles.mobileHeaderIcon} />
          </Button>
        </div>
      </div>
      <div className={styles.mobileBrand}>
        <InkspaceLogo className={styles.mobileBrandLogo} aria-hidden />
        <span className={styles.mobileBrandName}>Inkspace</span>
      </div>
    </>
  );
};

interface LeafNavItemProps {
  item: NavLeaf;
  pathname: string;
}

const LeafNavItem = ({ item, pathname }: LeafNavItemProps) => {
  const { setOpenMobile } = useSidebar();
  const active = checkIsLeafActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.label}
        isActive={active}
        render={<Link href={item.href} onClick={() => setOpenMobile(false)} />}
      >
        <Icon />
        <span className={styles.navItemLabel}>{item.label}</span>
        {item.badge !== undefined && (
          <span className={styles.navItemBadge}>{item.badge}</span>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const UserMenu = ({ userMenu }: { userMenu: SidebarUserMenu }) => {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const { status } = useSubscription(userMenu.subscriptionAware ?? false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const handleUpgrade = async () => {
    if (!token) return;
    setIsUpgrading(true);
    try {
      const { url } = await subscriptionApi.createCheckout(token);
      window.location.href = url;
    } catch (err) {
      setIsUpgrading(false);
      if (err instanceof ApiError && err.status === 409) {
        router.push("/dashboard/artist/settings?tab=billing");
        return;
      }
      displayToast(
        "Couldn't start checkout",
        "error",
        "Please try again in a moment.",
      );
    }
  };

  if (!user) return null;
  const name = getDisplayName(user);

  const subtitle =
    userMenu.subscriptionAware && status
      ? status.isPremium
        ? "Premium"
        : "Free"
      : userMenu.subtitle;
  const showUpgrade = userMenu.subscriptionAware
    ? status
      ? !status.isPremium
      : userMenu.showUpgrade
    : userMenu.showUpgrade;

  return (
    <div className={styles.userCard}>
      <div className={styles.userInitial} aria-hidden>
        {getUserInitial(user)}
      </div>
      <div className={styles.userInfo}>
        <div className={styles.userName}>{name}</div>
        <div className={styles.userSubtitle}>{subtitle}</div>
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
            {showUpgrade && (
              <Button
                variant="ghost"
                type="button"
                className={styles.upgradeButton}
                onClick={() => void handleUpgrade()}
                disabled={isUpgrading}
              >
                <Sparkles className={styles.upgradeIcon} />
                <span>Upgrade to Premium</span>
              </Button>
            )}
          </div>

          <div className={styles.popoverDivider} />

          <Button
            variant="ghost"
            type="button"
            className={styles.popoverItem}
            onClick={handleLogout}
          >
            <LogOut className={styles.popoverItemIcon} />
            <span>Log out</span>
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
