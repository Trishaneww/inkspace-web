// CSS
import styles from "@/styles/auth/Auth.module.css";

export const ApiErrorDisplay = ({ error }: { error: string }) => {
  return (
    <div className={styles.apiErrorContainer}>
      <p>{error}</p>
    </div>
  );
};
