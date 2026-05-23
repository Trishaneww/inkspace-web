import { redirect } from "next/navigation";

/*
  Root dashboard route — redirects to the correct dashboard based on user role.
  Role is determined server-side from the session token.

  artist  → /dashboard/artist
  client  → /dashboard/client
  studio  → /dashboard/studio
*/
export default function DashboardRootPage() {
  // TODO: replace with server-side role check once auth is wired
  redirect("/dashboard/artist");
}
