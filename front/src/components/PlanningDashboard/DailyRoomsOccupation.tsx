// components/DailyRoomsOccupation.tsx
import React from "react";
import { usePlanning } from "../../context/PlanningContext";
import { getDaySessions } from "../../utils/scheduleUtils";
import styles from "../../styles/PlanningDashboard/DailyRoomsOccupation.module.css";
import { usePlanningData } from "../../hooks/usePlanningData";
import { format, parse } from "date-fns";

interface DailyRoomsOccupationProps {
  date: string;
}

// Time slots definition moved outside component to prevent recreation
const timeSlots = [
  { start: "08:00", end: "10:00", label: "08:00-10:00" },
  { start: "10:15", end: "12:15", label: "10:15-12:15" },
  { start: "13:00", end: "15:00", label: "13:00-15:00" },
  { start: "15:15", end: "17:15", label: "15:15-17:15" },
];

const DailyRoomsOccupation: React.FC<DailyRoomsOccupationProps> = ({
  date,
}) => {
  const { dailyReports } = usePlanning();
  const { rooms, seances, loading, error, updatePresence } = usePlanningData();

  // Get sessions for the specified date
  const daySessions = getDaySessions(date, seances, dailyReports);

  if (loading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles["loading-spinner"]}></div>
        <p>Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["error-container"]}>
        <p className={styles["error-message"]}>{error}</p>
      </div>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className={styles["empty-state"]}>
        <p>Aucune salle n'est disponible.</p>
      </div>
    );
  }

  // Helper function to check if a session falls within a time slot
  const isSessionInTimeSlot = (session: any, slotStart: string, slotEnd: string) => {
    const sessionStartTime = session.startTime;
    const sessionEndTime = session.endTime;
    
    const parseTime = (time: string) => parse(time, 'HH:mm', new Date()).getTime();
    
    const slotStartTime = parseTime(slotStart);
    const slotEndTime = parseTime(slotEnd);
    const sessStartTime = parseTime(sessionStartTime);
    const sessEndTime = parseTime(sessionEndTime);
    
    return (
      (sessStartTime >= slotStartTime && sessStartTime < slotEndTime) ||
      (sessEndTime > slotStartTime && sessEndTime <= slotEndTime) ||
      (sessStartTime <= slotStartTime && sessEndTime >= slotEndTime)
    );
  };

  return (
    <div className={styles["daily-rooms-planning"]}>
      <h1>Planning journalier - Occupation des salles</h1>
      <h2>{format(new Date(date), 'dd MMMM yyyy')}</h2>

      <div className={styles["planning-grid"]}>
        {/* Time slots header */}
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

        {/* Room rows */}
        {rooms.map((room) => (
          <div key={room.id} className={styles["grid-row"]}>
            <div className={styles["room-cell"]}>
              {room.name}
              <div className={styles["room-info"]}>
                {room.capacity} places • {room.type}
              </div>
            </div>

            {/* Time slots for each room */}
            {timeSlots.map((slot) => {
              const session = daySessions.find(
                (s) =>
                  s.classroom?.name === room.name &&
                  isSessionInTimeSlot(s, slot.start, slot.end)
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
                        {session.professor?.firstName} {session.professor?.lastName}
                      </div>
                      <div className={styles["session-details"]}>
                        {session.type} • {session.group?.name}
                      </div>
                      <label className={styles["checkbox-label"]}>
                        <input
                          type="checkbox"
                          checked={session.professorPresent}
                          onChange={() => {
                            if (session.id) {
                              updatePresence(session.id, !session.professorPresent);
                            }
                          }}
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
