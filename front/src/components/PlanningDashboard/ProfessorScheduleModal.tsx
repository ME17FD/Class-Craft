import { Professor } from "../../types/type";
import { Session } from "../../types/schedule";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import * as XLSX from "xlsx";

interface ProfessorScheduleModalProps {
  professor: Professor;
  sessions: Session[];
  onClose: () => void;
}

const exportToExcel = (sessions: Session[], professorName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(
    sessions.map((s) => ({
      Jour: s.day,
      Heure: `${s.startTime} - ${s.endTime}`,
      Module: s.module?.name || s.subModule?.name,
      Type: s.type,
      Groupe: s.group?.name || "Non spécifié",
      Salle: s.classroom || "Non spécifiée",
      Durée: `${s.duration}h`,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Planning");
  XLSX.writeFile(workbook, `emploi-du-temps-${professorName}.xlsx`);
};

export const ProfessorScheduleModal = ({
  professor,
  sessions,
  onClose,
}: ProfessorScheduleModalProps) => {
  const timeSlots = [
    "",
    ...Array.from({ length: 11 }, (_, i) => `${8 + i}:00`.padStart(5, "0")), // 08:00 - 19:00
  ];

  const weekDays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const dayTranslations: Record<string, string> = {
    MONDAY: "Lundi",
    TUESDAY: "Mardi",
    WEDNESDAY: "Mercredi",
    THURSDAY: "Jeudi",
    FRIDAY: "Vendredi",
    SATURDAY: "Samedi",
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            Emploi du temps - {professor.firstName} {professor.lastName}
          </h2>
          <div className={styles.exportButtons}>
            <button
              onClick={() =>
                exportToExcel(
                  sessions,
                  `${professor.firstName}_${professor.lastName}`
                )
              }
              className={styles.excelButton}>
              Export Excel
            </button>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.scheduleGrid}>
          <div className={styles.timeColumn}>
            {timeSlots.map((time, i) => (
              <div key={`time-${i}`} className={styles.timeCell}>
                {i === 0 ? "" : time}
              </div>
            ))}
          </div>

          {weekDays.map((day) => {
            const daySessions = sessions.filter(
              (s) => s.day === day || s.dayOfWeek === day
            );

            return (
              <div key={`day-${day}`} className={styles.dayColumn}>
                <div className={styles.dayHeader}>
                  {dayTranslations[day] || day}
                </div>

                {timeSlots.slice(1).map((time) => {
                  const session = daySessions.find((s) => {
                    return s.startTime <= time && s.endTime > time;
                  });

                  return (
                    <div
                      key={
                        session ? `sess-${session.id}` : `empty-${day}-${time}`
                      }
                      className={`${styles.timeSlot} ${
                        session ? styles.occupied : ""
                      }`}>
                      {session && (
                        <div className={styles.sessionContent}>
                          <div className={styles.sessionTitle}>
                            {session.module?.name || session.subModule?.name}
                            <span className={styles.sessionType}>
                              {session.type} - {session.group?.name}
                            </span>
                          </div>
                          <div className={styles.sessionDetails}>
                            <div>
                              <strong>Salle:</strong> {session.classroom?.name}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfessorScheduleModal;
