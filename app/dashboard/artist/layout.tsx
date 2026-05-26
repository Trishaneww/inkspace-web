import { ArtistSidebar } from "@/components/layout/ArtistSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ArtistDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ArtistSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
