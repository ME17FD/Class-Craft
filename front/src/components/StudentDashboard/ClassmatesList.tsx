import React from "react";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { useApiData } from "../../hooks/useApiData";

const ClassmatesList = ({ group, currentStudentId }) => {
  const { students = [] } = useApiData();

  const classmates = group
    ? students.filter(
        (s) => s.groupId === group.id && s.id !== currentStudentId
      )
    : [];

  return (
    <div className={styles.classmatesContainer}>
      {classmates.length > 0 ? (
        <ul className={styles.classmatesGrid}>
          {classmates.map((student) => (
            <li key={student.id} className={styles.classmateCard}>
              <h4>
                {student.firstName} {student.lastName}
              </h4>
              <p>CNE: {student.cne}</p>
              <p>Email: {student.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.emptyClassmates}>
          {group
            ? "Aucun autre étudiant dans votre groupe"
            : "Vous n'êtes pas assigné à un groupe"}
        </div>
      )}
    </div>
  );
};

export default ClassmatesList;
