"use client";

// Next.js
import { useMemo, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

// Libs
import { filterSearchPages, type SearchPage } from "@/lib/sidebar/search-pages";

export function useGlobalSearch({
  onNavigate,
}: { onNavigate?: () => void } = {}) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => filterSearchPages(query), [query]);

  const changeQuery = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
  };

  const reset = () => {
    setQuery("");
    setActiveIndex(0);
  };

  const goToPage = (page: SearchPage) => {
    reset();
    onNavigate?.();
    router.push(page.href);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      goToPage(results[activeIndex] ?? results[0]);
    }
  };

  return {
    query,
    results,
    activeIndex,
    setActiveIndex,
    changeQuery,
    reset,
    goToPage,
    handleKeyDown,
  };
}
