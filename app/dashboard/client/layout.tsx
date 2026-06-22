// CSS
import styles from "@/styles/DashboardSidebar.module.css";

// HTML Components
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Components
import { ClientMobileNavbar } from "@/components/layout/ClientMobileNavbar";
import { ClientTopbar } from "@/components/layout/ClientTopbar";
import { ClientSidebar } from "@/components/layout/ClientSidebar";
import { RequireRole } from "@/components/auth/RequireRole";

// Libs
import { ClientBookingsProvider } from "@/lib/clientBookingsContext";
import { UserRole } from "@/types/index";

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole role={UserRole.User}>
      <ClientBookingsProvider>
        <SidebarProvider>
          <ClientSidebar />
          <SidebarInset className={styles.inset}>
            <ClientMobileNavbar />
            <ClientTopbar />
            <div className={styles.scrollArea}>{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </ClientBookingsProvider>
    </RequireRole>
  );
}
