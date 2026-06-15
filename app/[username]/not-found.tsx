// Next.js
import Link from "next/link";

// CSS
import styles from "@/styles/book/OpenBook.module.css";

// Components
import { OpenBookFrame } from "@/components/book/OpenBookFrame";

export default function OpenBookNotFound() {
  return (
    <OpenBookFrame>
      <div className={styles.notFoundCard}>
        <h1 className={styles.notFoundTitle}>Page not found</h1>
        <p className={styles.notFoundText}>
          This booking page does not exist or is not available yet.
        </p>
        <Link href="/" className={styles.notFoundLink}>
          Go to Inkspace
        </Link>
      </div>
    </OpenBookFrame>
  );
}
