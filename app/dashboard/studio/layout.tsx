import { StudioSidebar } from "@/components/layout/StudioSidebar";

export default function StudioDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <StudioSidebar />
      <main>{children}</main>
    </div>
  );
}
