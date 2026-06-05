// Next.js
import { Suspense } from "react";

// Components
import { ArtistSettings } from "@/components/dashboard/artist/settings/ArtistSettings";

export default function ArtistSettingsPage() {
  return (
    <Suspense>
      <ArtistSettings />
    </Suspense>
  );
}
