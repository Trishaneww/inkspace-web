// Next.js
import Image from "next/image";

// CSS
import styles from "@/styles/auth/Auth.module.css";

// HTML Components
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthForm = ({
  title,
  description,
  children,
  footer,
}: AuthCardProps) => {
  return (
    <div className={styles.authForm}>
      <div className={styles.authHeader}>
        <Image
          src="/logos/inkspace-logo.svg"
          alt="Inkspace Logo"
          width={100}
          height={100}
        />
        <h1 className={styles.authTitle}>{title}</h1>
        <p className={styles.authDescription}>{description}</p>
      </div>
      <Card className={styles.authCard}>
        <CardContent className={styles.content}>{children}</CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </div>
  );
};
