import React, { useState, useEffect } from "react";
import styles from "../../styles/PedagogicalDashboard-components/UnassignedStudentsModal.module.css";
import { Student } from "../../types/type";
import Button from "./Button";

interface UnassignedStudentsModalProps {
  onClose: () => void;
  onAssignStudent: (studentId: number) => void;
  students: Student[];
}

const UnassignedStudentsModal: React.FC<UnassignedStudentsModalProps> = ({
  onClose,
  onAssignStudent,
  students = [], // Valeur par défaut pour éviter undefined
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {
    try {
      // Filtrer les étudiants qui n'ont pas de groupe
      const unassignedStudents = students.filter(student => student.groupId === null);
      
      // Filtrer selon le terme de recherche (apogée)
      const filtered = unassignedStudents.filter(student =>
        student.apogee.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setFilteredStudents(filtered);
    } catch (error) {
      console.error("Erreur lors du filtrage des étudiants:", error);
      setFilteredStudents([]);
    }
  }, [students, searchTerm]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Ajouter un étudiant au groupe</h2>
        
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Rechercher par numéro Apogée..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.studentsList}>
          {filteredStudents.length === 0 ? (
            <p className={styles.noResults}>Aucun étudiant disponible</p>
          ) : (
            <table className={styles.studentsTable}>
              <thead>
                <tr>
                  <th>Apogée</th>
                  <th>Nom complet</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.apogee}</td>
                    <td>{`${student.lastName} ${student.firstName}`}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => onAssignStudent(student.id)}
                      >
                        Ajouter
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
        </div>
      </div>
    </div>
  );
};

export default UnassignedStudentsModal; 