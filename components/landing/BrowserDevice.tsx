// Next.js
import Image from "next/image";

// CSS
import styles from "@/styles/landing/BrowserDevice.module.css";

// HTML Components
import { ArrowLeft, ArrowRight, RotateCw, Lock } from "lucide-react";
import InkspaceLogo from "@/public/logos/inkspace-logo.svg";

export const BrowserDevice = () => {
  return (
    <div className={styles.device}>
      <div className={styles.tabs}>
        <span className={styles.dots} aria-hidden>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </span>
        <span className={styles.tab}>
          <InkspaceLogo className={styles.tabIcon} aria-hidden />
          <span className={styles.tabLabel}>Inkspace</span>
        </span>
      </div>

      <div className={styles.toolbar}>
        <span className={styles.nav} aria-hidden>
          <ArrowLeft size={16} />
          <ArrowRight size={16} />
          <RotateCw size={15} />
        </span>
        <span className={styles.address}>
          <Lock size={12} className={styles.lock} aria-hidden />
          inkspace.dev
        </span>
      </div>

      <div className={styles.shot}>
        <Image
          src="/landing/dashboard.png"
          alt="The Inkspace dashboard"
          fill
          unoptimized
          sizes="(max-width: 980px) 100vw, 960px"
          className={styles.shotImage}
        />
      </div>
    </div>
  );
};
