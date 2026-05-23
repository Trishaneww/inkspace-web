interface ArtistBookingPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArtistBookingPage({ params }: ArtistBookingPageProps) {
  const { slug } = await params;

  return (
    <div>
      <h1>Artist Booking Page: {slug}</h1>
      {/*
        Public-facing artist profile page (linked from Instagram/TikTok bio).
        Shows: portfolio, styles, pricing, availability, flash designs,
        reviews, and a booking/inquiry CTA.
      */}
    </div>
  );
}
