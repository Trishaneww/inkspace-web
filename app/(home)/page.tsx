// CSS
import styles from "@/styles/landing/Landing.module.css";

// Components
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { DashboardShowcase } from "@/components/landing/DashboardShowcase";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { ValuePropsSection } from "@/components/landing/ValuePropsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { SmoothScroll } from "@/components/landing/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <div className={styles.page}>
        <LandingHeader />
        <main>
          <LandingHero />
          <DashboardShowcase />
          <TestimonialsSection />
          <FeatureSection />
          <CtaSection />
          <ValuePropsSection />
          <FaqSection />
        </main>
        <LandingFooter />
      </div>
    </SmoothScroll>
  );
}
