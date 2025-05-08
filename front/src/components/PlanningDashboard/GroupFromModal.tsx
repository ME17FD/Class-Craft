import { useState, useEffect } from "react";
import { Group, Module, SubModule, Professor } from "../../types/type";

import { Sceance, Room } from "../../types/schedule";
import { GroupScheduleModal } from "./GroupScheduleModal";
import styles from "../../styles/PlanningDashboard/GroupFormModal.module.css";
import { useApiData } from "../../hooks/useApiData";

type Props = {
  show: boolean;
  group?: Group;
  onHide: () => void;
  onSave: (group: Group) => void;
  onSaveSession: (session: Sceance) => void;
};

export const GroupFormModal = ({
  show,
  group,
  onHide,
  onSave,
  onSaveSession,
}: Props) => {
  const { modules, subModules, professors, rooms, sessions } = useApiData();
  const [name, setName] = useState(group?.name || "");
  const [filiereId, setFiliereId] = useState(group?.filiereId || 0);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSession, setSelectedSession] = useState<Sceance | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: group?.id || Date.now(),
      name,
      filiereId,
      students: group?.students || [],
    });
    onHide();
  };

  const handleTimeSlotClick = (day: string, time: string) => {
    const existingSession = sessions.find(
      (s) => s.day === day && s.startTime === time && s.group.id === group?.id
    );

    setSelectedDay(day);
    setSelectedTime(time);
    setSelectedSession(existingSession || null);
    setShowSessionModal(true);
  };

  useEffect(() => {
    if (!show) {
      setShowSessionModal(false);
      setSelectedSession(null);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className={styles.modalOverlay} onClick={onHide}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{group ? "Modifier" : "Créer"} un groupe</h2>
          <button className={styles.closeButton} onClick={onHide}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nom du groupe</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Filière</label>
            <select
              value={filiereId}
              onChange={(e) => setFiliereId(Number(e.target.value))}>
              <option value={1}>Informatique</option>
              <option value={2}>Mathématiques</option>
            </select>
          </div>

          {group && (
            <div className={styles.scheduleSection}>
              <GroupScheduleModal
                group={group}
                sessions={sessions.filter((s) => s.group.id === group.id)}
                onClose={onHide}
                onTimeSlotClick={handleTimeSlotClick}
              />
            </div>
          )}

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onHide}>
              Annuler
            </button>
            <button type="submit" className={styles.saveButton}>
              Sauvegarder
            </button>
          </div>
        </form>

        {showSessionModal && (
          <SessionFormModal
            session={selectedSession}
            day={selectedDay}
            time={selectedTime}
            onClose={() => setShowSessionModal(false)}
            onSave={onSaveSession}
          />
        )}
      </div>
    </div>
  );
};

const SessionFormModal = ({
  session,
  day,
  time,
  onClose,
  onSave,
}: {
  session: Session | null;
  day: string;
  time: string;
  onClose: () => void;
  onSave: (session: Session) => void;
}) => {
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

    const newSession: Session = {
      ...(session || {}),
      id: session?.id || Date.now(),
      day,
      startTime: time,
      endTime: calculateEndTime(time, duration),
      professor: professors.find((p) => p.id === Number(selectedProfessor))!,
      module: modules.find((m) => m.id === Number(selectedModule)),
      subModule: subModules.find((sm) => sm.id === Number(selectedSubModule)),
      room: selectedRoom,
      type: selectedType,
      group: session?.group || ({} as Group),
      professorPresent: false,
      duration,
    };

    onSave(newSession);
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
              <label>Type de séance</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
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
                onChange={(e) => setSelectedModule(e.target.value)}
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
              <label>Sous-module</label>
              <select
                value={selectedSubModule}
                onChange={(e) => setSelectedSubModule(e.target.value)}>
                <option value="">Sélectionner un sous-module</option>
                {subModules
                  .filter((sm) => sm.moduleId === Number(selectedModule))
                  .map((subModule) => (
                    <option key={subModule.id} value={subModule.id}>
                      {subModule.name} ({subModule.hours}h)
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
                    {prof.name}
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
                value={duration}
                onChange={(e) =>
                  setDuration(Math.max(1, Math.min(55, Number(e.target.value))))
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
            <button type="submit" className={styles.saveButton}>
              {session ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
