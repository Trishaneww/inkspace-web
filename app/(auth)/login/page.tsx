// Next.js
import Image from "next/image";

// CSS
import styles from "@/styles/auth/Auth.module.css";

// Components
import { AuthForm } from "@/components/auth/AuthForm";
import { LoginFlow } from "@/components/auth/LoginFlow";

export default function LoginPage() {
  return (
    <div className={styles.authPage}>
      <div className={styles.authFormSide}>
        <AuthForm
          title="Welcome back to InkSpace"
          description="Use your email or a social provider to access your account."
        >
          <LoginFlow />
        </AuthForm>
      </div>

      <div className={styles.authImageSide}>
        <Image
          src="/inkspace-dashboard.png"
          alt="Inkspace dashboard preview"
          width={1000}
          height={2000}
          className={styles.authImage}
          priority
        />
      </div>
    </div>
  );
}
