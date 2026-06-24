// CSS
import styles from "@/styles/landing/Landing.module.css";

// Components
import { LandingHeader } from "@/components/landing/LandingHeader";
import { PricingSection } from "@/components/landing/PricingSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <LandingHeader />
      <main>
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  );
}
