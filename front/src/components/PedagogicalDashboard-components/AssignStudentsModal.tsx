import React from "react";
import styles from "../../styles/PedagogicalDashboard-components/AddStudentModal.module.css";
import { Student } from "../../types/type";
import Button from "./Button";

interface AddStudentModalProps {
  onSave: (studentData: Omit<Student, "id">) => void;
  onClose: () => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  onSave,
  onClose,
}) => {
  const [cne, setCne] = React.useState("");
  const [apogee, setApogee] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      cne,
      apogee,
      lastName,
      firstName,
      name: `${lastName} ${firstName}`, // On garde name pour la compatibilité
      groupId: null,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Ajouter un étudiant</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>CNE</label>
            <input
              type="text"
              value={cne}
              onChange={(e) => setCne(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Apogée</label>
            <input
              type="text"
              value={apogee}
              onChange={(e) => setApogee(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Ajouter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
