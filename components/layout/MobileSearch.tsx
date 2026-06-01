"use client";

// Next.js
import { useRef, useState } from "react";

// CSS
import styles from "@/styles/GlobalSearch.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ArrowLeft, Search } from "lucide-react";

// Components
import { SearchResultsList } from "@/components/layout/search/SearchResultsList";

// Libs
import { useGlobalSearch } from "@/components/layout/search/useGlobalSearch";

export const MobileSearch = () => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const search = useGlobalSearch({ onNavigate: () => setOpen(false) });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) search.reset();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon-lg"
        aria-label="Search"
        onClick={() => setOpen(true)}
      >
        <Search className={styles.mobileSearchIcon} />
      </Button>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          showCloseButton={false}
          initialFocus={inputRef}
          className={styles.mobileSheet}
        >
          <SheetTitle className={styles.visuallyHidden}>Search</SheetTitle>

          <div className={styles.mobileSearchHeader}>
            <div className={styles.mobileSearchBar}>
              <Button
                variant="ghost"
                type="button"
                className={styles.mobileBackButton}
                aria-label="Close search"
                onClick={() => handleOpenChange(false)}
              >
                <ArrowLeft />
              </Button>
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search"
                value={search.query}
                onChange={(event) => search.changeQuery(event.target.value)}
                onKeyDown={search.handleKeyDown}
                className={styles.mobileSearchInput}
              />
            </div>
          </div>

          <div className={styles.mobileResults}>
            <SearchResultsList
              results={search.results}
              activeIndex={search.activeIndex}
              onSelect={search.goToPage}
              onHover={search.setActiveIndex}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
