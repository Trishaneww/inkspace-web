// CSS
import styles from "@/styles/landing/Landing.module.css";

// Libs
import { VALUE_PROPS } from "@/constants/landing";

export const ValuePropsSection = () => {
  return (
    <section className={styles.values}>
      <div className={styles.valuesIntro}>
        <p className={styles.featuresEyebrow}>Why artists choose Inkspace</p>
        <h2 className={styles.valuesTitle}>
          Spend less time managing, more time creating
        </h2>
        <p className={styles.valuesSubtitle}>
          Inkspace brings every part of your tattoo business together and
          automates the operational work, so you can focus on your craft and
          your clients.
        </p>
      </div>

      <div className={styles.valuesGrid}>
        {VALUE_PROPS.map((value) => {
          const Icon = value.icon;

          return (
            <div key={value.key} className={styles.valueItem}>
              <Icon size={22} className={styles.valueIcon} aria-hidden />
              <h3 className={styles.valueItemTitle}>{value.title}</h3>
              <p className={styles.valueItemText}>{value.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
