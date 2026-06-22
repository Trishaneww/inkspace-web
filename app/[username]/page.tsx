// Next.js
import { notFound } from "next/navigation";

// Components
import { OpenBookFrame } from "@/components/book/OpenBookFrame";
import { OpenBookHub } from "@/components/book/OpenBookHub";

// Libs
import { ApiError } from "@/lib/api/client";
import { openBookApi } from "@/lib/api/openBook";
import type { OpenBookProfile } from "@/types/bookings";

interface ArtistProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ArtistProfilePage({
  params,
}: ArtistProfilePageProps) {
  const { username } = await params;
  const handle = decodeURIComponent(username);
  if (!handle.startsWith("@")) {
    notFound();
  }
  const slug = handle.slice(1);

  let profile: OpenBookProfile;
  try {
    profile = await openBookApi.getProfile(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <OpenBookFrame
      theme={profile.theme}
      customTheme={profile.customTheme}
      backgroundImageUrl={profile.backgroundImageUrl}
    >
      <OpenBookHub profile={profile} />
    </OpenBookFrame>
  );
}
