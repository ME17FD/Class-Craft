import { Session } from "../../types/schedule";
import { Group } from "../../types/type";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import * as XLSX from "xlsx";
import { PDFGenerator } from "./PDFGenerator";
import { usePlanning } from "../../context/PlanningContext";
import { useApiData } from "../../hooks/useApiData";
import { useMemo } from "react";

type Props = {
  group: Group | null;
  onClose: () => void;
  onTimeSlotClick: (day: string, time: string) => void;
};

const exportToExcel = (sessions: Session[], groupName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(
    sessions.map((s) => ({
      Jour: s.day || s.dayOfWeek,
      Heure: `${s.startTime} - ${s.endTime}`,
      Module: s.module?.name || s.subModule?.name,
      Type: s.type,
      Professeur: s.professor.firstName,
      Salle: s.classroom?.name || "Non spécifiée", // Changé ici
      Durée: `${s.duration}h`,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Planning");
  XLSX.writeFile(workbook, `emploi-du-temps-${groupName}.xlsx`);
};

export const GroupScheduleModal = ({
  group,
  onClose,
  onTimeSlotClick,
}: Props) => {
  const { seances } = useApiData();
  const { sessions } = usePlanning();

  const normalizeTime = (time: string) => {
    if (!time) return "00:00";
    return time
      .split(":")
      .slice(0, 2)
      .map((t) => t.padStart(2, "0"))
      .join(":");
  };

  const groupSessions = useMemo(() => {
    const allSessions = [...seances, ...sessions];
    if (!group) return [];
    return allSessions.filter((s) => s.group?.id === group.id);
  }, [seances, sessions, group]);

  const timeSlots = useMemo(
    () => [
      "",
      ...Array.from({ length: 11 }, (_, i) => `${8 + i}:00`.padStart(5, "0")), // 08:00 - 19:00
    ],
    []
  );

  const weekDays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const dayTranslations = {
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
            Emploi du temps - {group.name} (ID: {group.id})
          </h2>
          <div className={styles.exportButtons}>
            <button
              onClick={() => exportToExcel(groupSessions, group.name)}
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
            const daySessions = groupSessions.filter(
              (s) => s.day === day || s.dayOfWeek === day
            );

            return (
              <div key={`day-${day}`} className={styles.dayColumn}>
                <div className={styles.dayHeader}>
                  {dayTranslations[day] || day}
                </div>

                {timeSlots.slice(1).map((time) => {
                  const normalizedTime = normalizeTime(time);
                  const session = daySessions.find((s) => {
                    const start = normalizeTime(s.startTime);
                    const end = normalizeTime(s.endTime);
                    return start <= normalizedTime && end > normalizedTime;
                  });
                  const slotKey = session
                    ? `sess-${session.id}-${day}-${normalizedTime.replace(
                        ":",
                        ""
                      )}`
                    : `empty-${day}-${normalizedTime.replace(":", "")}`;

                  return (
                    <div
                      key={slotKey}
                      className={`${styles.timeSlot} ${
                        session ? styles.occupied : ""
                      }`}
                      onClick={() => onTimeSlotClick(day, time)}>
                      {session && (
                        <div className={styles.sessionContent}>
                          <div className={styles.sessionTitle}>
                            {session.module?.name ||
                              session.subModule?.name ||
                              "Cours"}
                            {"\n"}
                            <span className={styles.sessionType}>
                              {session.type}
                            </span>
                          </div>
                          <div className={styles.sessionDetails}>
                            <div>
                              <strong>Salle:</strong>{" "}
                              {session.classroom?.name || "Non spécifiée"}
                            </div>
                            <div>
                              <strong>Prof:</strong>{" "}
                              {session.professor?.firstName || ""}{" "}
                              {session.professor?.lastName || ""}
                              <span
                                className={
                                  session.professorPresent
                                    ? styles.present
                                    : styles.absent
                                }>
                                <strong>Présence:</strong>{" "}
                                {session.professorPresent ? " ✔" : " ✖"}
                              </span>
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

export default GroupScheduleModal;
