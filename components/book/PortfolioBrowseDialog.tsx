"use client";

// Next.js
import Image from "next/image";

// CSS
import clsx from "clsx";
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Components
import { PortfolioGridPhase } from "./PortfolioGridPhase";
import { PortfolioDetailPhase } from "./PortfolioDetailPhase";

// Hooks
import { usePortfolioBrowse } from "@/hooks/usePortfolioBrowse";

// Libs
import { PORTFOLIO_BROWSE_PHASE_META } from "@/constants/portfolioBrowse";
import { PortfolioBrowsePhase } from "@/types/portfolioBrowse";

interface PortfolioBrowseDialogProps {
  artistId: string;
  onOpenChange: (open: boolean) => void;
}

export const PortfolioBrowseDialog = ({
  artistId,
  onOpenChange,
}: PortfolioBrowseDialogProps) => {
  const {
    phase,
    items,
    loading,
    error,
    selectedItem,
    activeImageIndex,
    selectItem,
    setActiveImageIndex,
    goBack,
    close,
  } = usePortfolioBrowse(artistId, onOpenChange);

  const isGrid = phase === PortfolioBrowsePhase.Grid;

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) close();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={styles.onboardingDialog}
      >
        <div className={styles.topbar}>
          <Image
            src="/logos/inkspace-logo.svg"
            alt="Inkspace"
            width={40}
            height={40}
            className={styles.logo}
          />
        </div>

        <div className={styles.content}>
          <div className={clsx(styles.phaseColumn, styles.fullWidth)}>
            {isGrid && <PortfolioBrowseHeading phase={phase} />}
            <div className={styles.fields}>
              {isGrid ? (
                <PortfolioGridPhase
                  items={items}
                  loading={loading}
                  error={error}
                  onSelect={selectItem}
                />
              ) : (
                selectedItem && (
                  <PortfolioDetailPhase
                    item={selectedItem}
                    activeImageIndex={activeImageIndex}
                    onSelectImage={setActiveImageIndex}
                  />
                )
              )}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <Button type="button" className={styles.backLink} onClick={goBack}>
              <ArrowLeft size={16} />
              {isGrid ? "Close" : "Back"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PortfolioBrowseHeading = ({ phase }: { phase: PortfolioBrowsePhase }) => {
  const { lead, rest } = PORTFOLIO_BROWSE_PHASE_META[phase];

  return (
    <DialogTitle className={styles.heading}>
      <span className={styles.headingLead}>{lead}</span> {rest}
    </DialogTitle>
  );
};
