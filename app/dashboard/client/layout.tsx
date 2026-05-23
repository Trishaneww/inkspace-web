import { ClientSidebar } from "@/components/layout/ClientSidebar";

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ClientSidebar />
      <main>{children}</main>
    </div>
  );
}
