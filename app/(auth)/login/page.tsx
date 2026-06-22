// CSS
import styles from "@/styles/auth/Auth.module.css";

// Components
import { AuthForm } from "@/components/auth/AuthForm";
import { LoginFlow } from "@/components/auth/LoginFlow";
import { ShowcaseCard } from "@/components/landing/ShowcaseCard";

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
        <ShowcaseCard />
      </div>
    </div>
  );
}
