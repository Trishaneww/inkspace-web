import { ArtistSidebar } from "@/components/layout/ArtistSidebar";

export default function ArtistDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ArtistSidebar />
      <main>{children}</main>
    </div>
  );
}
