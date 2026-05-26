// Next.js
import Image from "next/image";

// CSS
import styles from "@/styles/auth/Auth.module.css";

// Components
import { AuthForm } from "@/components/auth/AuthForm";
import { SignupFlow } from "@/components/auth/SignupFlow";

export default function SignupPage() {
  return (
    <div className={styles.authPage}>
      <div className={styles.authFormSide}>
        <AuthForm
          title="Create your account"
          description="Tell us a bit about you. We'll verify your phone next."
        >
          <SignupFlow />
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
