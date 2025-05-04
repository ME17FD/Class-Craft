// SessionFormModal.tsx
import { Session, Module, SubModule, Professor, Room } from "../../types/type";
import { useStaticData } from "../../hooks/useStaticData";
import { useState, useEffect } from "react";
type Props = {
  day: string;
  time: string;
  session: Session | null;
  onClose: () => void;
  onSave: (session: Session) => void;
};

export const SessionFormModal = ({
  day,
  time,
  session,
  onClose,
  onSave,
}: Props) => {
  const { modules, subModules, professors, rooms } = useStaticData();
  const [selectedModule, setSelectedModule] = useState(
    session?.module?.id || ""
  );
  const [selectedSubModule, setSelectedSubModule] = useState(
    session?.subModule?.id || ""
  );
  const [selectedProfessor, setSelectedProfessor] = useState(
    session?.professor.id || ""
  );
  const [selectedRoom, setSelectedRoom] = useState(session?.room || "");
  const [selectedType, setSelectedType] = useState(session?.type || "CM");
  const [duration, setDuration] = useState(session?.duration || 1);
  useEffect(() => {
    if (selectedSubModule) {
      const subMod = subModules.find(
        (sm) => sm.id === Number(selectedSubModule)
      );
      setDuration(subMod?.hours || 1);
    }
  }, [selectedSubModule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSession: Session = {
      ...(session || {}),
      id: session?.id || Date.now(),
      day,
      startTime: time,
      duration,
      endTime: calculateEndTime(selectedTime, duration),
      module: modules.find((m) => m.id === Number(selectedModule)),
      subModule: subModules.find((sm) => sm.id === Number(selectedSubModule)),
      professor: professors.find((p) => p.id === Number(selectedProfessor))!,
      room: selectedRoom,
      type: selectedType,
    };

    onSave(newSession);
    onClose();
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
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{session ? "Modifier" : "Créer"} une séance</h2>
        <form onSubmit={handleSubmit}>
          {/* Champs du formulaire */}
          <div className={styles.formGroup}>
            <label>Type de séance</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}>
              <option value="CM">Cours Magistral</option>
              <option value="TD">Travaux Dirigés</option>
              <option value="TP">Travaux Pratiques</option>
              <option value="EXAM">Examen</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Module</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Sous-module</label>
            <select
              value={selectedSubModule}
              onChange={(e) => setSelectedSubModule(e.target.value)}>
              {subModules
                .filter((sm) => sm.moduleId === Number(selectedModule))
                .map((subModule) => (
                  <option key={subModule.id} value={subModule.id}>
                    {subModule.name}
                  </option>
                ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Professeur</label>
            <select
              value={selectedProfessor}
              onChange={(e) => setSelectedProfessor(e.target.value)}>
              {professors.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Durée (heures)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className={styles.durationInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Salle</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}>
              {rooms.map((room) => (
                <option key={room.id} value={room.name}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>
  );
};
