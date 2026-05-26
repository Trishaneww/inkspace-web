// CSS
import styles from "@/styles/auth/Auth.module.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className={styles.authLayout}>{children}</main>;
}
