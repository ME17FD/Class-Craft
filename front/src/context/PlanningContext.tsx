import { createContext, useContext, useState, ReactNode } from "react";
import { Session, WeeklySchedule, DailyReport } from "../types/schedule";
import { getWeek } from "date-fns";

type PlanningContextType = {
  sessions: Session[];
  weeklySchedules: WeeklySchedule[];
  dailyReports: DailyReport[];
  selectedSession: Session | null;
  setSelectedSession: (session: Session | null) => void;
  addSession: (session: Session) => void;
  generateWeeklySchedule: (groupId: number) => void;
  toggleProfessorPresence: (sessionId: number) => void;
};

const PlanningContext = createContext<PlanningContextType | undefined>(
  undefined
);

export const PlanningProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [weeklySchedules, setWeeklySchedules] = useState<WeeklySchedule[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const addSession = (session: Session) => {
    setSessions((prev) => [...prev, session]);
    updateDailyReports([...sessions, session]);
  };

  const generateWeeklySchedule = (groupId: number) => {
    const groupSessions = sessions.filter((s) => s.group.id === groupId);
    const newSchedule: WeeklySchedule = {
      id: Date.now(),
      group: groupSessions[0].group,
      sessions: groupSessions,
      weekNumber: getWeek(new Date(), { weekStartsOn: 1 }),
      semester: 1,
      academicYear: "2023-2024",
    };
    setWeeklySchedules((prev) => [...prev, newSchedule]);
  };

  const toggleProfessorPresence = (sessionId: number) => {
    setDailyReports((prev) =>
      prev.map((report) => ({
        ...report,
        sessions: report.sessions.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                professorPresent: !session.professorPresent,
              }
            : session
        ),
      }))
    );
  };

  const updateDailyReports = (allSessions: Session[]) => {
    const reportsByDate = allSessions.reduce((acc, session) => {
      const date = new Date().toISOString().split("T")[0]; // À remplacer par la vraie date
      const sessionWithPresence = {
        ...session,
        professorPresent: session.professorPresent || true, // Valeur par défaut
      };

      if (!acc[date]) acc[date] = [];
      acc[date].push(sessionWithPresence);
      return acc;
    }, {} as Record<string, Session[]>);

    setDailyReports(
      Object.entries(reportsByDate).map(([date, sessions]) => ({
        id: Date.now(),
        date,
        sessions: sessions.map((s) => ({
          ...s,
          professorPresent: s.professorPresent || true, // Garantir la présence de la propriété
        })),
      }))
    );
  };

  return (
    <PlanningContext.Provider
      value={{
        sessions,
        weeklySchedules,
        dailyReports,
        selectedSession,
        setSelectedSession,
        addSession,
        generateWeeklySchedule,
        toggleProfessorPresence,
      }}>
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context)
    throw new Error("usePlanning must be used within PlanningProvider");
  return context;
};

export default PlanningContext;
