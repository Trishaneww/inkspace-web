// CSS
import styles from "@/styles/ArtistDashboardLayout.module.css";

// HTML Components
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Components
import { ArtistMobileNavbar } from "@/components/layout/ArtistMobileNavbar";
import { ArtistTopbar } from "@/components/layout/ArtistTopbar";
import { ArtistSidebar } from "@/components/layout/ArtistSidebar";
import { OnboardingGate } from "@/components/onboarding/OnboardingGate";

export default function ArtistDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ArtistSidebar />
      <SidebarInset className={styles.inset}>
        <ArtistMobileNavbar />
        <ArtistTopbar />
        <div className={styles.scrollArea}>{children}</div>
      </SidebarInset>
      <OnboardingGate />
    </SidebarProvider>
  );
}
