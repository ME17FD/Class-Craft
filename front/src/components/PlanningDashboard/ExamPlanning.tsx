import { useState } from "react";
import { useApiData } from "../../hooks/useApiData";
import { usePlanningData } from "../../hooks/usePlanningData";
import { ExamsCard } from "./ExamsCard";
import { ExamModal } from "./ExamModal";
import { MakeupModal } from "./RattrapageModal";
import { ExamScheduleModal } from "./ExamScheduleModal";
import { MakeupScheduleModal } from "./RattrapageScheduleModal";
import { Session } from "../../types/schedule";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { Group, Professor } from "../../types/type";

export const ExamPlanning = () => {
  const { groups = [] } = useApiData();
  const { reservations = [] } = usePlanningData();
  const [selectedExam, setSelectedExam] = useState<Session | null>(null);
  const [selectedMakeup, setSelectedMakeup] = useState<Session | null>(null);
  const [selectedGroupForExamSchedule, setSelectedGroupForExamSchedule] =
    useState<Group | null>(null);
  const [selectedGroupForMakeupSchedule, setSelectedGroupForMakeupSchedule] =
    useState<Group | null>(null);
  const [, setSelectedTimeSlot] = useState<{
    day: string;
    time: string;
    type: "EXAM" | "RATTRAPAGE";
  } | null>(null);

  const handleTimeSlotClick = (
    day: string,
    time: string,
    type: "EXAM" | "RATTRAPAGE"
  ) => {
    setSelectedTimeSlot({ day, time, type });

    // Trouver la session existante
    const group =
      type === "EXAM"
        ? selectedGroupForExamSchedule
        : selectedGroupForMakeupSchedule;
    const existingSession = reservations.find(
      (s) =>
        s.groupId === group?.id &&
        s.type === type &&
        new Date(s.startDateTime!).toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase() === day.toLowerCase() &&
        new Date(s.startDateTime!).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) === time
    );

    if (existingSession) {
      type === "EXAM"
        ? setSelectedExam(existingSession)
        : setSelectedMakeup(existingSession);
    } else {
      // Créer une nouvelle session
      const startDate = new Date();
      startDate.setHours(parseInt(time.split(':')[0]));
      startDate.setMinutes(parseInt(time.split(':')[1]));
      
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + (type === "EXAM" ? 2 : 1.5));

      const newSession: Session = {
        id: 0,
        type,
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        wasAttended: false,
        groupId: group?.id || null,
        groupName: group?.name || null,
        classroomId: 0,
        subModuleId: 0
      };
      type === "EXAM"
        ? setSelectedExam(newSession)
        : setSelectedMakeup(newSession);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Examens et Rattrapages par Groupe</h1>

      <div className={styles.groupExamsGrid}>
        {groups.map((group) => {
          const groupSessions = reservations.filter(
            (s) => s.groupId === group.id
          );
          const exams = groupSessions.filter((s) => s.type === "EXAM");
          const makeups = groupSessions.filter((s) => s.type === "RATTRAPAGE");

          return (
            <ExamsCard
              key={group.id}
              group={group}
              exams={exams}
              makeups={makeups}
              onExamClick={() => setSelectedGroupForExamSchedule(group)}
              onMakeupClick={() => setSelectedGroupForMakeupSchedule(group)}
            />
          );
        })}
      </div>

      {/* Modal pour le planning des examens */}
      {selectedGroupForExamSchedule && (
        <ExamScheduleModal
          group={selectedGroupForExamSchedule}
          sessions={reservations.filter(
            (s) =>
              s.groupId === selectedGroupForExamSchedule.id &&
              s.type === "EXAM"
          )}
          onClose={() => setSelectedGroupForExamSchedule(null)}
          onTimeSlotClick={(day, time) =>
            handleTimeSlotClick(day, time, "EXAM")
          }
        />
      )}

      {/* Modal pour le planning des rattrapages */}
      {selectedGroupForMakeupSchedule && (
        <MakeupScheduleModal
          group={selectedGroupForMakeupSchedule}
          sessions={reservations.filter(
            (s) =>
              s.groupId === selectedGroupForMakeupSchedule.id &&
              s.type === "RATTRAPAGE"
          )}
          onClose={() => setSelectedGroupForMakeupSchedule(null)}
          onTimeSlotClick={(day, time) =>
            handleTimeSlotClick(day, time, "RATTRAPAGE")
          }
        />
      )}

      {/* Modal pour la modification/création d'examen */}
      {selectedExam && (
        <ExamModal
          exam={selectedExam}
          rooms={[]}
          onClose={() => {
            setSelectedExam(null);
            setSelectedTimeSlot(null);
          }}
          onSave={(updatedExam) => {
            console.log("Examen sauvegardé:", updatedExam);
            setSelectedExam(null);
            setSelectedTimeSlot(null);
          }}
        />
      )}

      {/* Modal pour la modification/création de rattrapage */}
      {selectedMakeup && (
        <MakeupModal
          makeup={selectedMakeup}
          rooms={[]}
          onClose={() => {
            setSelectedMakeup(null);
            setSelectedTimeSlot(null);
          }}
          onSave={(updatedMakeup) => {
            console.log("Rattrapage sauvegardé:", updatedMakeup);
            setSelectedMakeup(null);
            setSelectedTimeSlot(null);
          }}
        />
      )}
    </div>
  );
};

export default ExamPlanning;
