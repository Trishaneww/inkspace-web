// CSS
import clsx from "clsx";
import styles from "@/styles/landing/Pricing.module.css";

// Components
import { PricingCta } from "@/components/landing/PricingCta";

// Libs
import { Check } from "lucide-react";
import { PRICING_TIERS } from "@/constants/landing";

export const PricingSection = () => {
  return (
    <section className={styles.pricing}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Pricing</p>
        <h1 className={styles.title}>Simple pricing that grows with you</h1>
        <p className={styles.subtitle}>
          Start free and run your whole studio. Upgrade to Premium for AI that
          works your inquiries for you, and a lower fee on every payment.
        </p>
      </div>

      <div className={styles.grid}>
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.key}
            className={clsx(styles.card, {
              [styles.cardFeatured]: tier.featured,
            })}
          >
            {tier.featured && (
              <span className={styles.badge}>Most popular</span>
            )}

            <h2 className={styles.planName}>{tier.name}</h2>

            <p className={styles.price}>
              <span className={styles.priceAmount}>{tier.price}</span>
              <span className={styles.pricePeriod}>{tier.period}</span>
            </p>

            <p className={styles.planDescription}>{tier.description}</p>

            <PricingCta
              tier={tier}
              className={clsx(styles.cta, {
                [styles.ctaFeatured]: tier.featured,
              })}
            />

            <p className={styles.featuresLead}>{tier.featuresLead}</p>
            <ul className={styles.features}>
              {tier.features.map((feature) => (
                <li key={feature} className={styles.feature}>
                  <Check size={18} className={styles.featureIcon} aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
