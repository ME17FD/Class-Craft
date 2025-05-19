import React from "react";
import styles from "../../styles/StudentDashboard.module.css";
import { Session } from "../../types/schedule";

interface Props {
  sessions: Session[];
}

const ProfessorSessions = ({ sessions }: Props) => {
  return (
    <div className={styles.scheduleContainer}>
      {sessions.length > 0 ? (
        sessions.map((session) => (
          <div key={session.id} className={styles.sessionItem}>
            <div className={styles.sessionHeader}>
              <span className={styles.sessionDay}>{session.day}</span>
              <span className={styles.sessionTime}>
                {session.startTime} - {session.endTime}
              </span>
            </div>
            <div className={styles.sessionBody}>
              <h4>{session.module?.name || session.subModule?.name}</h4>
              <p>Groupe: {session.group?.name}</p>
              <p>Salle: {session.classroom?.name || "Non spécifiée"}</p>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.emptySchedule}>Aucune séance programmée</div>
      )}
    </div>
  );
};

export default ProfessorSessions;
