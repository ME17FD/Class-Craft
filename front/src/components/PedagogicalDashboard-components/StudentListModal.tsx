import React from "react";
import styles from "../../styles/PedagogicalDashboard-components/StudentListModal.module.css";
import { Group, Student } from "../../types/type";
import Button from "./Button";

interface StudentListModalProps {
  group: Group;
  onAddStudent: () => void;
  onRemoveStudent: (studentId: number) => void;
  onClose: () => void;
}

const StudentListModal: React.FC<StudentListModalProps> = ({
  group,
  onAddStudent,
  onRemoveStudent,
  onClose,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Étudiants du groupe {group.name}</h2>

        <div className={styles.studentList}>
          {group.students.length === 0 ? (
            <p className={styles.emptyMessage}>Aucun étudiant dans ce groupe</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Apogée</th>
                  <th>CNE</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {group.students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.apogee}</td>
                    <td>{student.cne}</td>
                    <td>{student.lastName}</td>
                    <td>{student.firstName}</td>
                    <td>
                      <Button
                        variant="delete"
                        onClick={() => onRemoveStudent(student.id)}
                        small>
                        Retirer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={onAddStudent}>
            Ajouter un étudiant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentListModal;
