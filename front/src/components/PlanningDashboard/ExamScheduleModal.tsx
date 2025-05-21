import { Session } from "../../types/schedule";
import { Group } from "../../types/type";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { useMemo } from "react";
import { PDFGenerator } from "./PDFGenerator";

interface ExamScheduleModalProps {
  group: Group;
  sessions: Session[];
  onClose: () => void;
  onTimeSlotClick: (day: string, time: string) => void;
}

export const ExamScheduleModal = ({
  group,
  sessions,
  onClose,
  onTimeSlotClick,
}: ExamScheduleModalProps) => {
  const timeSlots = useMemo(
    () => [
      "",
      ...Array.from({ length: 11 }, (_, i) => `${8 + i}:00`.padStart(5, "0")),
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

  const dayTranslations: Record<string, string> = {
    MONDAY: "Lundi",
    TUESDAY: "Mardi",
    WEDNESDAY: "Mercredi",
    THURSDAY: "Jeudi",
    FRIDAY: "Vendredi",
    SATURDAY: "Samedi",
  };

  const normalizeTime = (time: string) => {
    if (!time) return "00:00";
    return time
      .split(":")
      .slice(0, 2)
      .map((t) => t.padStart(2, "0"))
      .join(":");
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Planning des Examens - {group.name}</h2>
          <div className={styles.exportButtons}>
            <PDFGenerator
              data={{
                type: "exam",
                group: group,
                sessions: sessions,
              }}
            />
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
                  const normalizedTime = normalizeTime(time);
                  const session = daySessions.find((s) => {
                    const start = normalizeTime(s.startTime || "");
                    const end = normalizeTime(s.endTime || "");
                    return start <= normalizedTime && end > normalizedTime;
                  });

                  return (
                    <div
                      key={
                        session ? `exam-${session.id}` : `empty-${day}-${time}`
                      }
                      className={`${styles.timeSlot} ${styles.examSession} ${
                        session ? styles.occupied : ""
                      }`}
                      onClick={() => onTimeSlotClick(day, time)}>
                      {session && (
                        <div className={styles.sessionContent}>
                          <div className={styles.sessionTitle}>
                            {session.module?.name || session.subModule?.name}
                          </div>
                          <div className={styles.sessionDetails}>
                            <div>
                              <strong>Salle:</strong> {session.classroom?.name}
                            </div>
                            <div>
                              <strong>Surveillant:</strong>{" "}
                              {session.professor?.firstName}{" "}
                              {session.professor?.lastName}
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
