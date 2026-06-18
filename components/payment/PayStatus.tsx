// CSS
import styles from "@/styles/pay/PayPage.module.css";

export function PayStatus({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.content}>
      <div className={styles.status}>
        {icon}
        <p className={styles.statusTitle}>{title}</p>
        <p className={styles.statusDescription}>{description}</p>
      </div>
    </div>
  );
}
