import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
    padding: 30,
    lineHeight: 1.5,
    color: "#000000",
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1f2937",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #333",
    marginBottom: 4,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  col1: { width: "25%", fontWeight: "bold" },
  col2: { width: "25%" },
  col3: { width: "50%" },
  label: {
    fontWeight: "bold",
    marginRight: 4,
  },
  tip: {
    marginBottom: 4,
  },
});

interface TxnData {
  date: string;
  amount: number;
  label: string;
}

interface Recommendation {
  newProvider: string;
  savingsPerMonth: number;
  newEMI: number;
  originalEMI: number;
}

interface ParsedData {
  summary: { totalEMIs: number; suspiciousTxns: number; creditScore: number };
  emis: TxnData[];
  fraudFlags: TxnData[];
  advisor: Recommendation[];
  insights?: {
    totalLoanAmount?: number;
    averageEMI?: number;
    monthlyEMIs?: Record<string, number>;
    suspiciousVendors?: Record<string, number>;
    financialTips?: string[];
  };
}

export const FinReportPDF = ({ parsed }: { parsed: ParsedData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>FinSight AI Report</Text>

      <View style={styles.section}>
        <Text style={styles.subHeader}>📊 Summary</Text>
        <Text><Text style={styles.label}>Credit Score:</Text> {parsed.summary.creditScore}</Text>
        <Text><Text style={styles.label}>Total EMIs:</Text> {parsed.summary.totalEMIs}</Text>
        <Text><Text style={styles.label}>Suspicious Transactions:</Text> {parsed.summary.suspiciousTxns}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>💼 Active EMIs</Text>
        {parsed.emis?.length ? (
          <>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Date</Text>
              <Text style={styles.col2}>Amount</Text>
              <Text style={styles.col3}>Label</Text>
            </View>
            {parsed.emis.map((emi, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.col1}>{emi.date}</Text>
                <Text style={styles.col2}>₹{emi.amount}</Text>
                <Text style={styles.col3}>{emi.label}</Text>
              </View>
            ))}
          </>
        ) : <Text>No EMI data available.</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>🚨 Suspicious Transactions</Text>
        {parsed.fraudFlags?.length ? (
          <>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Date</Text>
              <Text style={styles.col2}>Amount</Text>
              <Text style={styles.col3}>Label</Text>
            </View>
            {parsed.fraudFlags.map((f, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.col1}>{f.date}</Text>
                <Text style={styles.col2}>₹{f.amount}</Text>
                <Text style={styles.col3}>{f.label}</Text>
              </View>
            ))}
          </>
        ) : <Text>No suspicious activity found.</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>💡 AI Loan Advisor</Text>
        {parsed.advisor?.length ? (
          parsed.advisor.map((rec, i) => (
            <Text key={i}>
              {rec.newProvider} → Save ₹{rec.savingsPerMonth}/mo | New EMI: ₹{rec.newEMI} (Old: ₹{rec.originalEMI})
            </Text>
          ))
        ) : (
          <Text>No recommendations available.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>📌 Financial Tips</Text>
        {parsed.insights?.financialTips?.length ? (
          parsed.insights.financialTips.map((tip, i) => (
            <Text key={i} style={styles.tip}>• {tip}</Text>
          ))
        ) : <Text>No financial tips available.</Text>}
      </View>
    </Page>
  </Document>
);
