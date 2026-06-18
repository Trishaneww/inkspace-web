// Libs
import { EMAIL_COLORS } from "@/constants/emails";

export const styles = {
  body: {
    margin: 0,
    padding: "24px 0",
    backgroundColor: EMAIL_COLORS.pageBg,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  container: {
    width: "92%",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: EMAIL_COLORS.cardBg,
    borderRadius: "16px",
    overflow: "hidden",
  },
  header: {
    height: "132px",
    textAlign: "center" as const,
    backgroundColor: EMAIL_COLORS.primary,
    backgroundImage: `linear-gradient(120deg, ${EMAIL_COLORS.primary} 58%, ${EMAIL_COLORS.primaryLight} 58%)`,
  },
  badge: {
    width: "76px",
    height: "76px",
    margin: "28px auto 0",
    backgroundColor: EMAIL_COLORS.cardBg,
    borderRadius: "50%",
    textAlign: "center" as const,
    lineHeight: "76px",
  },
  logo: {
    display: "inline-block",
    verticalAlign: "middle",
  },
  content: {
    padding: "32px 40px 8px",
  },
  greeting: {
    margin: "0 0 12px",
    fontSize: "18px",
    fontWeight: 600,
    color: EMAIL_COLORS.textStrong,
  },
  lead: {
    margin: "0 0 12px",
    fontSize: "15px",
    lineHeight: "24px",
    color: EMAIL_COLORS.textStrong,
  },
  paragraph: {
    margin: "0 0 24px",
    fontSize: "15px",
    lineHeight: "24px",
    color: EMAIL_COLORS.textMuted,
  },
  summary: {
    padding: "8px 20px",
    backgroundColor: EMAIL_COLORS.summaryBg,
    borderRadius: "10px",
  },
  summaryRow: {
    padding: "8px 0",
  },
  summaryDivider: {
    margin: "4px 0",
    borderColor: EMAIL_COLORS.border,
  },
  summaryLabel: {
    fontSize: "14px",
    fontWeight: 500,
    color: EMAIL_COLORS.textMuted,
  },
  summaryValue: {
    fontSize: "14px",
    fontWeight: 600,
    textAlign: "right" as const,
    color: EMAIL_COLORS.textStrong,
  },
  summaryAmount: {
    fontSize: "20px",
    fontWeight: 700,
    textAlign: "right" as const,
    color: EMAIL_COLORS.textStrong,
  },
  buttonWrap: {
    padding: "28px 0 8px",
    textAlign: "center" as const,
  },
  button: {
    display: "inline-block",
    padding: "13px 32px",
    backgroundColor: EMAIL_COLORS.primary,
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    color: EMAIL_COLORS.cardBg,
    textDecoration: "none",
  },
  fineprint: {
    margin: "16px 0 0",
    fontSize: "13px",
    lineHeight: "20px",
    textAlign: "center" as const,
    color: EMAIL_COLORS.textMuted,
  },
  hr: {
    margin: "24px 40px",
    borderColor: EMAIL_COLORS.border,
  },
  footer: {
    padding: "0 40px 32px",
    textAlign: "center" as const,
  },
  footerText: {
    margin: "2px 0",
    fontSize: "12px",
    lineHeight: "18px",
    color: EMAIL_COLORS.textMuted,
  },
};
