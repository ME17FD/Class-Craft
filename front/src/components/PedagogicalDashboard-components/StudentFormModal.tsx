import React, { useState, useEffect } from "react";
import styles from "../../styles/PedagogicalDashboard-components/StudentFormModal.module.css";
import { Student, Group } from "../../types/type";
import Button from "./Button";

interface StudentFormModalProps {
  student: Student;
  groups: Group[];
  onSave: (studentData: Omit<Student, "id">) => void;
  onClose: () => void;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({
  student,
  groups,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Omit<Student, "id">>({
    cne: "",
    apogee: "",
    lastName: "",
    firstName: "",
    groupId: null,
  });

  useEffect(() => {
    if (student) {
      setFormData({
        cne: student.cne,
        apogee: student.apogee,
        lastName: student.lastName,
        firstName: student.firstName,
        groupId: student.groupId,
      });
    }
  }, [student]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{student.id ? "Modifier l'étudiant" : "Ajouter un étudiant"}</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>CNE</label>
              <input
                type="text"
                name="cne"
                value={formData.cne}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Apogée</label>
              <input
                type="text"
                name="apogee"
                value={formData.apogee}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Groupe</label>
            <select
              name="groupId"
              value={formData.groupId || ""}
              onChange={handleChange}>
              <option value="">Non affecté</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {student.id ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;
