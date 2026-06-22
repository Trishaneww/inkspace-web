"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/GlobalSearch.module.css";

// HTML Components
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Libs
import type { SearchPage } from "@/lib/sidebar/searchPages";

interface SearchResultsListProps {
  results: SearchPage[];
  activeIndex: number;
  onSelect: (page: SearchPage) => void;
  onHover: (index: number) => void;
}

export const SearchResultsList = ({
  results,
  activeIndex,
  onSelect,
  onHover,
}: SearchResultsListProps) => {
  if (results.length === 0) {
    return <div className={styles.searchEmpty}>No pages found</div>;
  }

  return (
    <div className={styles.searchResults}>
      <div className={styles.searchSectionLabel}>Go to</div>
      {results.map((page, index) => {
        const Icon = page.icon;
        return (
          <Button
            variant="ghost"
            key={page.label}
            type="button"
            className={clsx(
              styles.searchResult,
              index === activeIndex && styles.searchResultActive,
            )}
            onClick={() => onSelect(page)}
            onMouseEnter={() => onHover(index)}
          >
            <Icon className={styles.searchResultIcon} />
            <span className={styles.searchResultTrail}>
              {page.breadcrumb.map((crumb) => (
                <span key={crumb} className={styles.searchCrumb}>
                  {crumb}
                  <ChevronRight className={styles.searchCrumbSeparator} />
                </span>
              ))}
              <span className={styles.searchResultLabel}>{page.label}</span>
            </span>
          </Button>
        );
      })}
    </div>
  );
};
