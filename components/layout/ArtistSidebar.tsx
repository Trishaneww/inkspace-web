"use client";

// Next.js
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// CSS
import styles from "@/styles/ArtistSidebar.module.css";

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
  SidebarMenuBadge,
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
import {
  artistMainNav,
  artistWorkNav,
  artistOtherNav,
  type NavLeaf,
} from "@/lib/sidebar/sidebar-config";
import {
  getDisplayName,
  checkIsLeafActive,
  getUserInitial,
} from "@/lib/sidebar/utils";

export const ArtistSidebar = () => {
  const pathname = usePathname() ?? "";
  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" className={styles.sidebarRoot}>
      <SidebarHeader>
        {isMobile ? (
          <MobileHeader />
        ) : (
          <div className={styles.brandRow}>
            <InkspaceLogo className={styles.brandLogo} aria-hidden />
            <span className={styles.brandName}>Inkspace</span>
            <SidebarTrigger className={styles.brandTrigger} />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {artistMainNav.map((item) => (
                <LeafNavItem key={item.href} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Your Work</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {artistWorkNav.map((item) => (
                <LeafNavItem key={item.href} item={item} pathname={pathname} />
              ))}
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
        <UserMenu />
        <div className={styles.copyright}>© 2026 Inkspace Inc.</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

const MobileHeader = () => {
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
              <Link
                href="/dashboard/artist/settings"
                onClick={() => setOpenMobile(false)}
              />
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
      </SidebarMenuButton>
      {item.badge !== undefined && (
        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
      )}
    </SidebarMenuItem>
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
            <Button  variant="ghost" type="button" className={styles.upgradeButton}>
              <Sparkles className={styles.upgradeIcon} />
              <span>Upgrade to Pro+</span>
            </Button>
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
