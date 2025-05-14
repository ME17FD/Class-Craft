import { useState, useEffect } from "react";
import { Module, SubModule, Professor, Group } from "../../types/type";
import { Room, Session } from "../../types/schedule";
import styles from "../../styles/PlanningDashboard/GroupFormModal.module.css";
import api from "../../services/api";

interface SessionFormModalProps {
  session: Session | null;
  day: string;
  time: string;
  modules: Module[];
  subModules: SubModule[];
  professors: Professor[];
  rooms: Room[];
  groups: Group[];
  existingSessions: Session[];
  onClose: () => void;
  onSave: (session: Session) => void;
}

export const SessionFormModal = ({
  session,
  day,
  time,
  onClose,
  onSave,
  modules = [],
  subModules = [],
  professors = [],
  rooms = [],
  groups = [],
  existingSessions = [],
}: SessionFormModalProps) => {
  const [selectedModule, setSelectedModule] = useState(
    session?.module?.id?.toString() || ""
  );
  const [selectedSubModule, setSelectedSubModule] = useState(
    session?.subModule?.id?.toString() || ""
  );
  const [selectedProfessor, setSelectedProfessor] = useState(
    session?.professor?.id?.toString() || ""
  );
  const [selectedRoom, setSelectedRoom] = useState(session?.classroom || "");
  const [selectedType, setSelectedType] = useState(session?.type || "CM");
  const [selectedGroup, setSelectedGroup] = useState<string>(
    session?.group?.id?.toString() || ""
  );
  const [duration, setDuration] = useState(session?.duration || 1);

  // Get groups based on mode (add/edit)
  // Modifier la fonction getAvailableGroups comme suit:
  const getAvailableGroups = () => {
    if (session?.id) {
      // Edit mode - return only the current group (locked)
      return groups.filter((group) => group.id === session.group?.id);
    } else {
      // Add mode - only show groups without any sessions in the entire schedule
      return groups.filter((group) => {
        const hasSession = existingSessions.some(
          (s) => s.group?.id === group.id
        );
        return !hasSession;
      });
    }
  };

  const availableGroups = getAvailableGroups();

  useEffect(() => {
    if (selectedSubModule) {
      const subMod = subModules.find(
        (sm) => sm.id === Number(selectedSubModule)
      );
      setDuration(subMod?.nbrHours || 1);
    }
  }, [selectedSubModule, subModules]);

  const calculateEndTime = (start: string, hours: number) => {
    const [h, m] = start.split(":").map(Number);
    const totalMinutes = h * 60 + m + hours * 60;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    return `${endH.toString().padStart(2, "0")}:${endM
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate and find all required objects
      const selectedProf = professors.find(
        (p) => p.id === Number(selectedProfessor)
      );
      const selectedMod = modules.find((m) => m.id === Number(selectedModule));

      const selectedRoomObj = rooms.find((r) => r.name === selectedRoom);
      const selectedGroupObj = availableGroups.find(
        (g) => g.id === Number(selectedGroup)
      );

      if (
        !selectedProf ||
        !selectedMod ||
        !selectedRoomObj ||
        !selectedGroupObj
      ) {
        alert("Veuillez remplir tous les champs obligatoires");
        return;
      }
      const selectedSubMod = subModules.find(
        (sm) => sm.id === Number(selectedSubModule)
      );
      // Format times for backend
      const formatTimeForBackend = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:00`;
      };

      const sessionData = {
        day,
        startTime: formatTimeForBackend(time),
        endTime: formatTimeForBackend(calculateEndTime(time, duration)),
        professor: { id: selectedProf.id },
        module: { id: selectedMod.id },
        subModule: selectedSubMod ? { id: selectedSubMod.id } : null,
        room: { id: selectedRoomObj.id },
        type: selectedType,
        group: { id: selectedGroupObj.id },
        professorPresent: session?.professorPresent || false,
        duration,
      };

      // Send request
      const response = session?.id
        ? await api.put(`/api/seances/${session.id}`, sessionData)
        : await api.post("/api/seances", sessionData);

      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la séance:", error);
      alert(
        `Erreur lors de l'enregistrement: 
        
        `
      );
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>
            {session ? "Modifier" : "Créer"} une séance - {day} {time}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Groupe</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                required
                disabled={!!session?.id} // Désactivé en mode édition
              >
                <option value="">Sélectionner un groupe</option>
                {availableGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              {availableGroups.length === 0 && !session?.id && (
                <p className={styles.errorText}>
                  Tous les groupes disponibles ont déjà une séance dans le
                  planning
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Type de séance</label>
              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as Session["type"])
                }
                required>
                <option value="CM">CM</option>
                <option value="TD">TD</option>
                <option value="TP">TP</option>
                <option value="EXAM">Examen</option>
                <option value="RATTRAPAGE">Rattrapage</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Module</label>
              <select
                value={selectedModule}
                onChange={(e) => {
                  setSelectedModule(e.target.value);
                  setSelectedSubModule("");
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

            <div className={styles.formGroup}>
              <label>Sous-module (optionnel)</label> {/* Modifié le label */}
              <select
                value={selectedSubModule}
                onChange={(e) => setSelectedSubModule(e.target.value)}
                disabled={!selectedModule}>
                <option value="">
                  Sélectionner un sous-module (optionnel)
                </option>{" "}
                {/* Modifié */}
                {subModules
                  .filter((sm) => sm.moduleId === Number(selectedModule))
                  .map((subModule) => (
                    <option key={subModule.id} value={subModule.id}>
                      {subModule.name} ({subModule.nbrHours}h)
                    </option>
                  ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Professeur</label>
              <select
                value={selectedProfessor}
                onChange={(e) => setSelectedProfessor(e.target.value)}
                required>
                <option value="">Sélectionner un professeur</option>
                {professors.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.firstName} {prof.lastName}
                  </option>
                ))}
              </select>
            </div>

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

            <div className={styles.formGroup}>
              <label>Durée (heures)</label>
              <input
                type="number"
                min="1"
                max="8"
                value={duration}
                onChange={(e) =>
                  setDuration(Math.max(1, Math.min(8, Number(e.target.value))))
                }
                className={styles.durationInput}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}>
              Annuler
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={availableGroups.length === 0 && !session?.id}>
              {session ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionFormModal;
