// CSS
import styles from "@/styles/landing/Landing.module.css";

// HTML Components
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// Libs
import { FAQS } from "@/constants/landing";

export const FaqSection = () => {
  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.faqIntro}>
        <p className={styles.featuresEyebrow}>FAQ</p>
        <h2 className={styles.faqTitle}>Frequently asked questions</h2>
      </div>

      <Accordion className={styles.faqList}>
        {FAQS.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="py-4 text-base md:py-5 md:text-[1.2rem]">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm md:text-[1.05rem]">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
