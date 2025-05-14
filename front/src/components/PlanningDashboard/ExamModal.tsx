import { Room, Session } from "../../types/schedule";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { useState } from "react";
import { useApiData } from "../../hooks/useApiData";

interface ExamModalProps {
  exam: Session;
  rooms: Room[];

  onClose: () => void;
  onSave: (exam: Session) => void;
}

export const ExamModal = ({ exam, onClose, onSave }: ExamModalProps) => {
  const {
    professors = [],
    modules = [],
    subModules = [],
    groups = [],
    rooms = [],
  } = useApiData();
  const [editedExam, setEditedExam] = useState(exam);
  const [selectedRoom, setSelectedRoom] = useState(exam?.classroom || "");
  const handleChange = (field: keyof Session, value: any) => {
    setEditedExam((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateEndTime = (start: string, hours: number) => {
    const [h, m] = start.split(":").map(Number);
    const totalMinutes = h * 60 + m + hours * 60;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    return `${endH.toString().padStart(2, "0")}:${endM
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calcul automatique de l'heure de fin si la durée ou l'heure de début change
    const updatedExam = {
      ...editedExam,
      endTime: calculateEndTime(editedExam.startTime, editedExam.duration),
    };

    onSave(updatedExam);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{exam.id ? "Modifier" : "Créer"} un examen</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Module */}
            <div className={styles.formGroup}>
              <label>Module</label>
              <select
                value={editedExam.module?.id || ""}
                onChange={(e) => {
                  const module = modules.find(
                    (m) => m.id === Number(e.target.value)
                  );
                  handleChange("module", module);
                }}
                required>
                <option value="">Sélectionner un module</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sous-module */}
            <div className={styles.formGroup}>
              <label>Sous-module</label>
              <select
                value={editedExam.subModule?.id || ""}
                onChange={(e) => {
                  const subModule = subModules.find(
                    (sm) => sm.id === Number(e.target.value)
                  );
                  handleChange("subModule", subModule);
                }}
                disabled={!editedExam.module}>
                <option value="">Sélectionner un sous-module</option>
                {subModules
                  .filter((sm) => sm.moduleId === editedExam.module?.id)
                  .map((subModule) => (
                    <option key={subModule.id} value={subModule.id}>
                      {subModule.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Groupe */}

            {/* Surveillant */}
            <div className={styles.formGroup}>
              <label>Surveillant</label>
              <select
                value={editedExam.professor?.id || ""}
                onChange={(e) => {
                  const professor = professors.find(
                    (p) => p.id === Number(e.target.value)
                  );
                  if (professor) handleChange("professor", professor);
                }}
                required>
                <option value="">Sélectionner un surveillant</option>
                {professors.map((professor) => (
                  <option key={professor.id} value={professor.id}>
                    {professor.firstName} {professor.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className={styles.formGroup}>
              <label>Date</label>
              <input
                type="date"
                value={editedExam.day || ""}
                onChange={(e) => handleChange("day", e.target.value)}
                required
              />
            </div>

            {/* Heure de début */}
            <div className={styles.formGroup}>
              <label>Heure de début</label>
              <input
                type="time"
                value={editedExam.startTime || ""}
                onChange={(e) => {
                  handleChange("startTime", e.target.value);
                  // Recalculer l'heure de fin automatiquement
                  handleChange(
                    "endTime",
                    calculateEndTime(e.target.value, editedExam.duration)
                  );
                }}
                required
              />
            </div>

            {/* Durée */}
            <div className={styles.formGroup}>
              <label>Durée (heures)</label>
              <input
                type="number"
                min="1"
                max="6"
                step="0.5"
                value={editedExam.duration || 2}
                onChange={(e) => {
                  const duration = parseFloat(e.target.value);
                  handleChange("duration", duration);
                  // Recalculer l'heure de fin automatiquement
                  handleChange(
                    "endTime",
                    calculateEndTime(editedExam.startTime, duration)
                  );
                }}
                required
              />
            </div>

            {/* Heure de fin (calculée automatiquement) */}
            <div className={styles.formGroup}>
              <label>Heure de fin</label>
              <input
                type="text"
                value={editedExam.endTime || ""}
                readOnly
                className={styles.readOnlyInput}
              />
            </div>

            {/* Salle */}
            <div className={styles.formGroup}>
              <label>Salle</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                required>
                <option value="">Sélectionner une salle</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.name}>
                    {room.name} ({room.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className={styles.saveButton}>
              {exam.id ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
