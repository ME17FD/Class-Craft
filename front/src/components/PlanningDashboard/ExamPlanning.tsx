import { useState } from "react";
import { useApiData } from "../../hooks/useApiData";
import { usePlanning } from "../../context/PlanningContext";
import { ExamsCard } from "./ExamsCard";
import { ExamModal } from "./ExamModal";
import { MakeupModal } from "./RattrapageModal";
import { ExamScheduleModal } from "./ExamScheduleModal";
import { MakeupScheduleModal } from "./RattrapageScheduleModal";
import { Session } from "../../types/schedule";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { Group, Professor } from "../../types/type";

export const ExamPlanning = () => {
  const { groups = [], seances = [] } = useApiData();
  const { sessions = [] } = usePlanning();
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

  const allSessions = [...seances, ...sessions];

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
    const existingSession = allSessions.find(
      (s) =>
        s.group?.id === group?.id &&
        s.type === type &&
        (s.day === day || s.dayOfWeek === day) &&
        s.startTime === time
    );

    if (existingSession) {
      type === "EXAM"
        ? setSelectedExam(existingSession)
        : setSelectedMakeup(existingSession);
    } else {
      // Créer une nouvelle session
      const newSession = {
        id: 0,
        type,
        day,
        startTime: time,
        endTime: calculateEndTime(time, type === "EXAM" ? 2 : 1.5),
        duration: type === "EXAM" ? 2 : 1.5,
        professor: {} as Professor,
        group: group!,
        classroom: "",
        professorPresent: false,
      };
      type === "EXAM"
        ? setSelectedExam(newSession)
        : setSelectedMakeup(newSession);
    }
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
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Examens et Rattrapages par Groupe</h1>

      <div className={styles.groupExamsGrid}>
        {groups.map((group) => {
          const groupSessions = allSessions.filter(
            (s) => s.group?.id === group.id
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
          sessions={allSessions.filter(
            (s) =>
              s.group?.id === selectedGroupForExamSchedule.id &&
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
          sessions={allSessions.filter(
            (s) =>
              s.group?.id === selectedGroupForMakeupSchedule.id &&
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
