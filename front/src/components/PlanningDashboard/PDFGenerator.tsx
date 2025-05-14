// PDFGenerator.tsx
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import style from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { Group } from "../../types/type";
import { Session } from "../../types/schedule";
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  table: {
    width: "100%",
    marginHorizontal: "auto",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#cccccc",
    paddingVertical: 5,
  },
  tableHeader: {
    width: "20%",
    padding: 5,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    width: "20%",
    padding: 5,
    fontSize: 10,
  },
});

const PdfDocument = ({
  group,
  sessions,
}: {
  group: Group;
  sessions: Session[];
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Emploi du temps - {group.name}</Text>
      <View style={styles.table}>
        {/* Entêtes */}
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Jour</Text>
          <Text style={styles.tableHeader}>Heure</Text>
          <Text style={styles.tableHeader}>Module</Text>
          <Text style={styles.tableHeader}>Professeur</Text>
          <Text style={styles.tableHeader}>Salle</Text>
        </View>

        {/* Données */}
        {sessions.map((session) => (
          <View style={styles.tableRow} key={session.id}>
            <Text style={styles.tableCell}>{session.day}</Text>
            <Text style={styles.tableCell}>
              {session.startTime} - {session.endTime}
            </Text>
            <Text style={styles.tableCell}>
              {session.module?.name || session.subModule?.name}
            </Text>
            <Text style={styles.tableCell}>
              {session.professor.firstName} {session.professor.lastName}
            </Text>
            <Text style={styles.tableCell}>{session.classroom.name}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export const PDFGenerator = ({
  group,
  sessions,
}: {
  group: Group;
  sessions: Session[];
}) => (
  <PDFDownloadLink
    document={<PdfDocument group={group} sessions={sessions} />}
    fileName={`emploi-du-temps-${group.name}.pdf`}>
    {({ loading }) => (
      <button className={style.pdfButton} disabled={loading}>
        {loading ? "Génération..." : "📄 Télécharger PDF"}
      </button>
    )}
  </PDFDownloadLink>
);
