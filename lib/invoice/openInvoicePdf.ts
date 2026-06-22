// Libs
import { format } from "date-fns";

// Types
import type { RecentPayment } from "@/types/transactions";

const INKSPACE_LOGO_PATH = "/logos/inkspace-logo.png";

export async function openInvoicePdf(
  issuerName: string,
  payment: RecentPayment,
): Promise<void> {
  const tab = window.open("", "_blank");

  const paidDateLabel = payment.paidAt
    ? format(new Date(payment.paidAt), "MMMM d, yyyy")
    : "—";

  const [{ pdf }, { InvoiceDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/dashboard/artist/transactions/InvoiceDocument"),
  ]);

  const document = InvoiceDocument({
    issuerName,
    logoUrl: window.location.origin + INKSPACE_LOGO_PATH,
    payment,
    paidDateLabel,
  });

  const blob = await pdf(document).toBlob();
  const url = URL.createObjectURL(blob);

  if (tab) tab.location.href = url;
  else window.open(url, "_blank");
}
