"use client";

// Next.js
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

// CSS
import styles from "@/styles/GlobalSearch.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Components
import { SearchResultsList } from "@/components/layout/search/SearchResultsList";

// Libs
import { useGlobalSearch } from "@/components/layout/search/useGlobalSearch";

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const search = useGlobalSearch({ onNavigate: () => setOpen(false) });

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (open) search.handleKeyDown(event);
  };

  return (
    <div className={styles.search} ref={containerRef}>
      <Search className={styles.searchIcon} />
      <Input
        type="text"
        placeholder="Search"
        value={search.query}
        onChange={(event) => {
          search.changeQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={styles.searchInput}
      />

      {open && (
        <div className={styles.panel}>
          <SearchResultsList
            results={search.results}
            activeIndex={search.activeIndex}
            onSelect={search.goToPage}
            onHover={search.setActiveIndex}
          />
        </div>
      )}
    </div>
  );
};
