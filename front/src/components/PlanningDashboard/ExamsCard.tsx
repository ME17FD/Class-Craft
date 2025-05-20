import { Group } from "../../types/type";
import { Session } from "../../types/schedule";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";

interface GroupExamsCardProps {
  group: Group;
  exams: Session[];
  makeups: Session[];
  onExamClick: (exam: Session) => void;
  onMakeupClick: () => void;
}

export const ExamsCard = ({
  group,
  exams,
  makeups,
  onExamClick,
  onMakeupClick,
}: GroupExamsCardProps) => {
  const formatDateTime = (session: Session) => {
    // If we have startDateTime (new reservation format)
    if ('startDateTime' in session && session.startDateTime) {
      const date = new Date(session.startDateTime);
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
      const formattedDate = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const time = date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `${dayName} ${formattedDate} ${time}`;
    }

    // Fallback to old format
    const dayTranslation: Record<string, string> = {
      MONDAY: "Lundi",
      TUESDAY: "Mardi",
      WEDNESDAY: "Mercredi",
      THURSDAY: "Jeudi",
      FRIDAY: "Vendredi",
      SATURDAY: "Samedi",
    };
    const dayOfWeek = session.dayOfWeek?.toUpperCase() || '';
    const dayName = dayTranslation[dayOfWeek] || session.dayOfWeek || '';
    const time = session.startTime?.split(":").slice(0, 2).join(":") || "";
    return `${dayName} ${time}`;
  };

  return (
    <div className={styles.groupExamCard}>
      <div className={styles.cardHeader}>
        <h3>{group.name}</h3>
        <span className={styles.badge}>
          {exams.length + makeups.length} sessions
        </span>
      </div>

      <div className={styles.examList}>
        <h4>Examens ({exams.length})</h4>
        {exams.length > 0 ? (
          exams.map((exam) => (
            <div
              key={`exam-${exam.id}`}
              className={styles.examItem}
              onClick={() => onExamClick(exam)}>
              <div>
                <strong>{exam.submodule?.name || "Examen"}</strong>
                <span className={styles.examBadge}>Examen</span>
              </div>
              <div>
                {formatDateTime(exam)} - Salle {exam.classroom?.type} {exam.classroom?.name}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noItems}>Aucun examen programmé</div>
        )}
      </div>

      <div className={styles.makeupSection} onClick={onMakeupClick}>
        <h4>Rattrapages ({makeups.length})</h4>
        {makeups.length > 0 ? (
          makeups.map((makeup) => (
            <div key={`makeup-${makeup.id}`} className={styles.makeupItem}>
              <div>
                <strong>{makeup.submodule?.name || "Rattrapage"}</strong>
                <span className={styles.makeupBadge}>Rattrapage</span>
              </div>
              <div>
                {formatDateTime(makeup)} - Salle {makeup.classroom?.name}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noItems}>Aucun rattrapage programmé</div>
        )}
      </div>
    </div>
  );
};

export default ExamsCard;
