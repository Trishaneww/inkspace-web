// Next.js
import Image from "next/image";

// CSS
import styles from "@/styles/landing/ShowcaseCard.module.css";

// Components
import { BrowserDevice } from "./BrowserDevice";

export const ShowcaseCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.backdrop}>
        <Image
          src="/auth-background.png"
          alt=""
          aria-hidden
          fill
          priority
          className={styles.backdropImage}
        />
      </div>
      <div className={styles.device}>
        <BrowserDevice />
      </div>
    </div>
  );
};
