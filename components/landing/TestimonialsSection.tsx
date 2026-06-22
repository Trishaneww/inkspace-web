// Next.js
import Image from "next/image";

// CSS
import styles from "@/styles/landing/Landing.module.css";

// Libs
import { TESTIMONIALS } from "@/constants/landing";

export const TestimonialsSection = () => {
  return (
    <section className={styles.testimonials}>
      <div className={styles.testimonialGrid}>
        {TESTIMONIALS.map((testimonial) => (
          <figure key={testimonial.name} className={styles.testimonialCard}>
            <blockquote className={styles.testimonialQuote}>
              “{testimonial.quote}”
            </blockquote>
            <figcaption className={styles.testimonialAuthor}>
              <span className={styles.testimonialAvatar}>
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  unoptimized
                  sizes="48px"
                  className={styles.testimonialAvatarImage}
                />
              </span>
              <span className={styles.testimonialMeta}>
                <span className={styles.testimonialName}>
                  {testimonial.name}
                </span>
                <span className={styles.testimonialRole}>
                  {testimonial.role}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};
