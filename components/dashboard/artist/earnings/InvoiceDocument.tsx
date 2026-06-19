// PDF
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// Libs
import { PAYMENT_TYPE_LABELS, TYPE_LABELS } from "@/constants/bookings";
import { formatPrice } from "@/lib/formatters";

// Types
import type { RecentPayment } from "@/types/earnings";

interface InvoiceDocumentProps {
  issuerName: string;
  logoUrl: string;
  payment: RecentPayment;
  paidDateLabel: string;
}

export const InvoiceDocument = ({
  issuerName,
  logoUrl,
  payment,
  paidDateLabel,
}: InvoiceDocumentProps) => {
  const total = formatPrice(payment.clientChargeCents, payment.currency);
  const detail = `${TYPE_LABELS[payment.requestType]} tattoo${
    payment.placement ? ` · ${payment.placement}` : ""
  }`;

  return (
    <Document title={`Invoice ${payment.reference}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} fixed />

        <View style={styles.header}>
          <Text style={styles.title}>Invoice</Text>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={logoUrl} style={styles.logo} />
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Invoice number</Text>
          <Text>{payment.reference}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Date paid</Text>
          <Text>{paidDateLabel}</Text>
        </View>

        <View style={styles.parties}>
          <View>
            <Text style={styles.partyHeading}>From</Text>
            <Text>{issuerName}</Text>
          </View>
          <View>
            <Text style={styles.partyHeading}>Bill to</Text>
            <Text>{payment.clientName}</Text>
            <Text>{payment.clientEmail}</Text>
          </View>
        </View>

        <Text style={styles.amountLine}>
          {total} paid on {paidDateLabel}
        </Text>
        <Text style={styles.thanks}>Thanks for your business!</Text>

        <View style={styles.tableHead}>
          <Text style={styles.colDesc}>Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colUnit}>Unit price</Text>
          <Text style={styles.colAmount}>Amount</Text>
        </View>

        <View style={styles.itemRow}>
          <View style={styles.colDesc}>
            <Text style={styles.itemTitle}>
              {PAYMENT_TYPE_LABELS[payment.type]}
            </Text>
            <Text style={styles.itemDetail}>{detail}</Text>
          </View>
          <Text style={styles.colQty}>1</Text>
          <Text style={styles.colUnit}>{total}</Text>
          <Text style={styles.colAmount}>{total}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalsLabel}>Subtotal</Text>
          <Text style={styles.totalsValue}>{total}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalsLabel}>Total</Text>
          <Text style={styles.totalsValue}>{total}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalsLabelStrong}>Amount paid</Text>
          <Text style={styles.totalsValueStrong}>{total}</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            {payment.reference} {"·"} {total} paid on {paidDateLabel}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const COLORS = {
  primary: "#6666ff",
  textStrong: "#1f2937",
  textMuted: "#6b7280",
  border: "#e5e7eb",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingHorizontal: 48,
    paddingBottom: 56,
    fontSize: 10,
    color: COLORS.textStrong,
    fontFamily: "Helvetica",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
  },
  logo: {
    width: 36,
    height: 36,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  metaLabel: {
    width: 90,
    fontFamily: "Helvetica-Bold",
  },
  parties: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 28,
  },
  partyHeading: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  amountLine: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  thanks: {
    color: COLORS.textMuted,
    marginBottom: 28,
  },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 6,
    color: COLORS.textMuted,
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomColor: COLORS.border,
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  colDesc: { flex: 1 },
  colQty: { width: 60, textAlign: "right" },
  colUnit: { width: 90, textAlign: "right" },
  colAmount: { width: 90, textAlign: "right" },
  itemTitle: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  itemDetail: {
    color: COLORS.textMuted,
  },
  totalsLabel: {
    flex: 1,
    textAlign: "right",
    paddingRight: 16,
    color: COLORS.textMuted,
  },
  totalsLabelStrong: {
    flex: 1,
    textAlign: "right",
    paddingRight: 16,
    fontFamily: "Helvetica-Bold",
    color: COLORS.textStrong,
  },
  totalsValue: {
    width: 90,
    textAlign: "right",
  },
  totalsValueStrong: {
    width: 90,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 48,
    right: 48,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    color: COLORS.textMuted,
  },
});
