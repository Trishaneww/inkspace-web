import { redirect } from "next/navigation";

export default function DashboardRootPage() {
  // TODO: replace with server-side role check once auth is wired
  redirect("/dashboard/artist");
}
