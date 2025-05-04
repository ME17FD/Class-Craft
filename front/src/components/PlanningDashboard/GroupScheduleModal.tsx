import { Session } from "../../types/schedule";
import { Group } from "../../types/type";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import * as XLSX from "xlsx";
import { PDFGenerator } from "./PDFGenerator";
type Props = {
  group: Group | null;
  sessions: Session[];
  onClose: () => void;
  onTimeSlotClick: (day: string, time: string) => void;
};
const exportToExcel = (sessions: Session[], groupName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(
    sessions.map((s) => ({
      Jour: s.day,
      Heure: `${s.startTime} - ${s.endTime}`,
      Module: s.module?.name || s.subModule?.name,
      Type: s.type,
      Professeur: s.professor.name,
      Salle: s.room,
      Durée: `${s.duration}h`,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Planning");
  XLSX.writeFile(workbook, `emploi-du-temps-${groupName}.xlsx`);
};
export const GroupScheduleModal = ({
  group,
  sessions,
  onClose,
  onTimeSlotClick,
}: Props) => {
  if (!group) return null;

  const timeSlots = [
    "",
    ...Array.from({ length: 11 }, (_, i) => `${8 + i}:30`.padStart(5, "0")),
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Emploi du temps - {group.name}</h2>
          <div className={styles.exportButtons}>
            <PDFGenerator group={group} sessions={sessions} />
            <button
              onClick={() => exportToExcel(sessions, group.name)}
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
            <div className={styles.timeHeader}></div>
            {timeSlots.map((time) => (
              <div key={time} className={styles.timeCell}>
                {time}
              </div>
            ))}
          </div>

          {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map(
            (day) => (
              <div key={day} className={styles.dayColumn}>
                <div className={styles.dayHeader}>{day}</div>
                {timeSlots.map((time) => {
                  const session = sessions.find(
                    (s) =>
                      s.group.id === group.id &&
                      s.day === day &&
                      s.startTime <= time &&
                      s.endTime > time
                  );

                  return (
                    <div
                      key={`${day}-${time}`}
                      className={styles.timeSlot}
                      onClick={() => onTimeSlotClick(day, time)}>
                      {session && (
                        <div className={styles.sessionCard}>
                          <div className={styles.sessionContent}>
                            <div className={styles.sessionTitle}>
                              {session.module?.name || session.subModule?.name}
                              <span className={styles.durationBadge}>
                                {session.duration}h
                              </span>
                            </div>
                            <div className={styles.sessionDetails}>
                              <span>{session.room}</span>
                              <span>{session.professor.name}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
