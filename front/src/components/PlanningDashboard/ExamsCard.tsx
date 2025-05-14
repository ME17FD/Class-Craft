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
                <strong>{exam.module?.name || "Examen"}</strong>
                <span className={styles.examBadge}>Examen</span>
              </div>
              <div>
                {exam.day} à {exam.startTime} - Salle {exam.classroom?.name}
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
                <strong>{makeup.module?.name || "Rattrapage"}</strong>
                <span className={styles.makeupBadge}>Rattrapage</span>
              </div>
              <div>
                {makeup.day} à {makeup.startTime} - Salle{" "}
                {makeup.classroom?.name}
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
