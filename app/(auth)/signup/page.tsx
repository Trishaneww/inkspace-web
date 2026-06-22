// CSS
import styles from "@/styles/auth/Auth.module.css";

// Components
import { AuthForm } from "@/components/auth/AuthForm";
import { SignupFlow } from "@/components/auth/SignupFlow";
import { ShowcaseCard } from "@/components/landing/ShowcaseCard";

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
        <ShowcaseCard />
      </div>
    </div>
  );
}
