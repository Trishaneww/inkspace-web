"use client";

// Next.js
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// CSS
import styles from "@/styles/dashboard/Dashboard.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { BookOpenCheck } from "lucide-react";

// Components
import { DashboardGrid } from "@/components/dashboard/artist/DashboardGrid";

// Libs
import { dashboardApi } from "@/lib/api/dashboard";
import { useAuth } from "@/lib/auth";
import { getGreeting } from "@/lib/dashboard/greeting";
import {
  DASHBOARD_RANGES,
  DEFAULT_DASHBOARD_RANGE,
} from "@/constants/dashboard";

// Types
import type { Dashboard, DashboardRange } from "@/types/dashboard";

export default function ArtistDashboardPage() {
  const { token, user } = useAuth();

  const [data, setData] = useState<Dashboard | null>(null);
  const [range, setRange] = useState<DashboardRange>(DEFAULT_DASHBOARD_RANGE);
  const [loadError, setLoadError] = useState<string | null>(null);
  const lastFetchKey = useRef<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!token) return;
    setLoadError(null);
    try {
      setData(await dashboardApi.get(token, range));
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load dashboard",
      );
    }
  }, [token, range]);

  useEffect(() => {
    if (!token) return;
    const key = `${token}:${range}`;
    if (lastFetchKey.current === key) return;
    lastFetchKey.current = key;
    queueMicrotask(fetchDashboard);
  }, [fetchDashboard, token, range]);

  const greeting = getGreeting();
  const firstName = user?.firstName ?? "";
  const activeRange = DASHBOARD_RANGES.find((option) => option.value === range);

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeaderContainer}>
        <div className={styles.greetingBlock}>
          <h1 className={styles.dashboardTitle}>
            {greeting}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <span className={styles.greetingSub}>
            Here is a snapshot of your business.
          </span>
        </div>
        <div className={styles.dashboardHeaderButtons}>
          <Select
            value={range}
            onValueChange={(next) => next && setRange(next as DashboardRange)}
          >
            <SelectTrigger className={styles.rangeSelect}>
              <span>{activeRange?.label}</span>
            </SelectTrigger>
            <SelectContent>
              {DASHBOARD_RANGES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className={styles.primaryBtn}
            nativeButton={false}
            render={<Link href="/dashboard/artist/bookings" />}
          >
            <BookOpenCheck />
            Manage Bookings
          </Button>
        </div>
      </div>

      {loadError && <div className={styles.errorBanner}>{loadError}</div>}

      {data && (
        <DashboardGrid
          data={data}
          rangeCaption={activeRange?.caption ?? ""}
          comparable={range !== "all"}
        />
      )}
    </div>
  );
}
