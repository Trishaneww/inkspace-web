"use client";

// Next.js
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// CSS
import styles from "@/styles/pay/PayPage.module.css";

// HTML Components
import { CircleAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Components
import { ExpressSignupCard } from "@/components/auth/ExpressSignupCard";
import { PayStatus } from "@/components/payment/PayStatus";
import { ShowcaseCard } from "@/components/landing/ShowcaseCard";

// Libs
import { publicBookingApi } from "@/lib/api/publicBooking";
import { useAuth } from "@/lib/auth";

// Types
import type { PublicBookingRequest } from "@/types/bookings";

const CLIENT_BOOKINGS = "/dashboard/client/bookings";

export default function BookPage() {
  const params = useParams<{ token: string }>();
  const token = String(params.token);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [request, setRequest] = useState<PublicBookingRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(CLIENT_BOOKINGS);
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    let active = true;
    publicBookingApi
      .get(token)
      .then((res) => active && setRequest(res))
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token]);

  function renderContent() {
    if (loading || authLoading || isAuthenticated) {
      return (
        <div className={styles.loading}>
          <Loader2 size={24} className="animate-spin" />
        </div>
      );
    }

    if (notFound || !request) {
      return (
        <PayStatus
          icon={<CircleAlert size={36} className={styles.iconMuted} />}
          title="Booking link not found"
          description="This link may be incorrect or has been removed."
        />
      );
    }

    const artist = request.artistName || "your artist";

    if (request.hasAccount) {
      return (
        <div className={styles.content}>
          <Image
            src="/logos/inkspace-logo.svg"
            alt="Inkspace"
            width={100}
            height={100}
            priority
          />
          <div className={styles.accountHeader}>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.description}>
              {artist} is ready to book you in. Log in to pick a time that works
              for you.
            </p>
          </div>
          <Button className={styles.cta} onClick={() => router.push("/login")}>
            Log in to pick your time
          </Button>
        </div>
      );
    }

    return (
      <ExpressSignupCard
        email={request.clientEmail}
        name={request.clientName}
        description={`${artist} is ready to book you in. Create an account to pick a time and manage your bookings — it only takes a few seconds.`}
        onSubmit={(input) => publicBookingApi.createClientAccount(token, input)}
      />
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.imageSide}>
        <ShowcaseCard />
      </div>

      <div className={styles.contentSide}>{renderContent()}</div>
    </main>
  );
}
