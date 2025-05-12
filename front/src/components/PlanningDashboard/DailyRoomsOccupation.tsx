// components/DailyRoomsOccupation.tsx
import React from "react";
import { usePlanning } from "../../context/PlanningContext";
import { Room } from "../../types/schedule";
import { getDaySessions } from "../../utils/scheduleUtils";
import styles from "../../styles/PlanningDashboard/DailyRoomsOccupation.module.css";

interface DailyRoomsOccupationProps {
  date: string;
  rooms: Room[];
}

const DailyRoomsOccupation: React.FC<DailyRoomsOccupationProps> = ({
  date,
  rooms,
}) => {
  const { dailyReports, sessions, toggleProfessorPresence } = usePlanning();

  // Définition des créneaux horaires fixes
  const timeSlots = [
    { start: "08:00", end: "10:00", label: "08:00-10:00" },
    { start: "10:15", end: "12:15", label: "10:15-12:15" },
    { start: "13:00", end: "15:00", label: "13:00-15:00" },
    { start: "15:15", end: "17:15", label: "15:15-17:15" },
  ];

  // Récupérer les sessions pour la date spécifiée
  const daySessions = getDaySessions(date, sessions, dailyReports);

  return (
    <div className={styles["daily-rooms-planning"]}>
      <h1>Planning journalier - Occupation des salles</h1>
      <h2>{date}</h2>

      <div className={styles["planning-grid"]}>
        {/* En-tête des créneaux horaires */}
        <div className={`${styles["grid-row"]} ${styles["header"]}`}>
          <div className={`${styles["room-cell"]} ${styles["header-cell"]}`}>
            SALLE
          </div>
          {timeSlots.map((slot) => (
            <div
              key={slot.label}
              className={`${styles["time-slot-cell"]} ${styles["header-cell"]}`}>
              {slot.label}
            </div>
          ))}
        </div>

        {/* Contenu par salle */}
        {rooms.map((room) => (
          <div key={room.id} className={styles["grid-row"]}>
            <div className={styles["room-cell"]}>
              {room.name}
              <div className={styles["room-info"]}>
                {room.capacity} places • {room.type}
              </div>
            </div>

            {timeSlots.map((slot) => {
              const session = daySessions.find(
                (s) =>
                  s.room === room.name &&
                  s.startTime === slot.start &&
                  s.endTime === slot.end
              );

              return (
                <div
                  key={`${room.id}-${slot.start}`}
                  className={`${styles["session-cell"]} ${
                    session ? styles["occupied"] : styles["empty"]
                  }`}>
                  {session ? (
                    <div className={styles["session-content"]}>
                      <div className={styles["session-title"]}>
                        {session.module?.name ||
                          session.subModule?.name ||
                          "Autre"}
                      </div>
                      <div className={styles["session-professor"]}>
                        {session.professor.name}
                      </div>
                      <div className={styles["session-details"]}>
                        {session.type} • {session.group.name}
                      </div>
                      <label className={styles["checkbox-label"]}>
                        <input
                          type="checkbox"
                          checked={session.professorPresent}
                          onChange={() => toggleProfessorPresence(session.id)}
                        />
                        Prof. présent
                      </label>
                    </div>
                  ) : (
                    <div className={styles["empty-label"]}>Libre</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyRoomsOccupation;
