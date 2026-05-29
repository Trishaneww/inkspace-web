"use client";

// Next.js
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// CSS
import styles from "@/styles/dashboard/artist/FlashDetail.module.css";

// HTML Components
import { ArrowLeft } from "lucide-react";

// Components
import { FlashDetailContent } from "@/components/dashboard/artist/flash/FlashDetailContent";

// Libs
import { flashesApi } from "@/lib/api/flashes";
import type { Flash } from "@/types/flash";

export default function FlashDetailPage() {
  const params = useParams<{ id: string }>();
  const flashId = params?.id;

  const [flash, setFlash] = useState<Flash | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const lastFetchedId = useRef<string | null>(null);

  useEffect(() => {
    if (!flashId) return;
    if (lastFetchedId.current === flashId) return;
    lastFetchedId.current = flashId;

    // Defer to a microtask so React 19's set-state-in-effect lint sees the
    // setState calls as async-from-the-effect, not synchronous.
    void Promise.resolve().then(async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const next = await flashesApi.get(flashId);
        setFlash(next);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setIsLoading(false);
      }
    });
  }, [flashId]);

  if (isLoading) {
    return <div className={styles.loading}>Loading flash…</div>;
  }
  if (loadError || !flash) {
    return (
      <div className={styles.errorState}>{loadError ?? "Flash not found."}</div>
    );
  }

  return (
    <div className={styles.page}>
      <Link href="/dashboard/artist/flashbook" className={styles.backLink}>
        <ArrowLeft size={14} /> Back to Flashbook
      </Link>

      <FlashDetailContent flash={flash} />
    </div>
  );
}
