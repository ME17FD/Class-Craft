import { Room, Session } from "../../types/schedule";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { useState } from "react";
import { useApiData } from "../../hooks/useApiData";

interface MakeupModalProps {
  makeup: Session;
  rooms: Room[];
  onClose: () => void;
  onSave: (makeup: Session) => void;
}

export const MakeupModal = ({ makeup, onClose, onSave }: MakeupModalProps) => {
  const {
    professors = [],
    modules = [],
    subModules = [],
    rooms = [],
  } = useApiData();
  const [editedMakeup, setEditedMakeup] = useState(makeup);
  const [, setSelectedRoom] = useState<Room | null>(
    makeup?.classroom ? rooms.find(r => r.id === Number(makeup.classroom)) || null : null
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof Session, value: any) => {
    setEditedMakeup((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedMakeup);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{makeup.id ? "Modifier" : "Créer"} un rattrapage</h2>
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
                value={editedMakeup.module?.id || ""}
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
                value={editedMakeup.subModule?.id || ""}
                onChange={(e) => {
                  const subModule = subModules.find(
                    (sm) => sm.id === Number(e.target.value)
                  );
                  handleChange("subModule", subModule);
                }}
                disabled={!editedMakeup.module}>
                <option value="">Sélectionner un sous-module</option>
                {subModules
                  .filter((sm) => sm.moduleId === editedMakeup.module?.id)
                  .map((subModule) => (
                    <option key={subModule.id} value={subModule.id}>
                      {subModule.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Groupe */}

            {/* Professeur */}
            <div className={styles.formGroup}>
              <label>Professeur</label>
              <select
                value={editedMakeup.professor?.id || ""}
                onChange={(e) => {
                  const professor = professors.find(
                    (p) => p.id === Number(e.target.value)
                  );
                  if (professor) handleChange("professor", professor);
                }}
                required>
                <option value="">Sélectionner un professeur</option>
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
                value={editedMakeup.day || ""}
                onChange={(e) => handleChange("day", e.target.value)}
                required
              />
            </div>

            {/* Heure de début */}
            <div className={styles.formGroup}>
              <label>Heure de début</label>
              <input
                type="time"
                value={editedMakeup.startTime || ""}
                onChange={(e) => handleChange("startTime", e.target.value)}
                required
              />
            </div>

            {/* Durée */}
            <div className={styles.formGroup}>
              <label>Durée (heures)</label>
              <input
                type="number"
                min="1"
                max="8"
                value={editedMakeup.duration || 1}
                onChange={(e) =>
                  handleChange("duration", Number(e.target.value))
                }
                required
              />
            </div>

            {/* Salle */}
            <div className={styles.formGroup}>
              <label>Salle</label>
              <select
                
                onChange={(e) => {
                  const room = rooms.find(r => r.id === Number(e.target.value));
                  setSelectedRoom(room || null);
                  handleChange("classroom", room?.id || null);
                }}
                required>
                <option value="">Sélectionner une salle</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.name}>
                    {room.name} ({room.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Date examen original */}

            {/* Raison */}
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className={styles.saveButton}>
              {makeup.id ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
