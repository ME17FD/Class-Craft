import React, { useState } from "react";
import styles from "../../styles/StudentDashboard.module.css";
import { Group, Student } from "../../types/type";
import { Session } from "../../types/schedule";
interface Props {
  groups: Group[];
  students: Student[];
  sessions: Session[];
}

const ProfessorGroups = ({ groups, students, sessions }: Props) => {
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [showStudents, setShowStudents] = useState<number | null>(null);

  return (
    <div className={styles.groupsContainer}>
      {groups.length > 0 ? (
        groups.map((group) => (
          <div key={group.id} className={styles.groupCard}>
            <div className={styles.cardHeader}>
              <h3>{group.name}</h3>
              <button
                className={styles.toggleButton}
                onClick={() =>
                  setExpandedGroup(expandedGroup === group.id ? null : group.id)
                }>
                {expandedGroup === group.id ? "Réduire" : "Voir planning"}
              </button>
            </div>

            {expandedGroup === group.id && (
              <div className={styles.groupDetails}>
                <div className={styles.schedulePreview}>
                  <h4>Emploi du temps</h4>
                  {sessions
                    .filter((s) => s.group?.id === group.id)
                    .map((session) => (
                      <div key={session.id} className={styles.sessionPreview}>
                        <span>{session.day}</span>
                        <span>
                          {session.startTime}-{session.endTime}
                        </span>
                        <span>{session.module?.name}</span>
                      </div>
                    ))}
                </div>

                <div className={styles.studentsSection}>
                  <button
                    className={styles.viewStudentsButton}
                    onClick={() =>
                      setShowStudents(
                        showStudents === group.id ? null : group.id
                      )
                    }>
                    {showStudents === group.id
                      ? "Masquer les étudiants"
                      : `Voir les étudiants (${
                          students.filter((s) => s.groupId === group.id).length
                        })`}
                  </button>

                  {showStudents === group.id && (
                    <div className={styles.studentsList}>
                      {students
                        .filter((s) => s.groupId === group.id)
                        .map((student) => (
                          <div key={student.id} className={styles.studentItem}>
                            {student.firstName} {student.lastName} -{" "}
                            {student.registrationNumber}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className={styles.emptyMessage}>Aucun groupe assigné</div>
      )}
    </div>
  );
};

export default ProfessorGroups;
