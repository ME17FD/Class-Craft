// utils/scheduleUtils.ts
import { Session, DailyReport, Room } from '../types/schedule';

export function getDaySessions(
  date: string, 
  allSessions: Session[], 
  dailyReports: DailyReport[]
): Session[] {
  // 1. Vérifier d'abord dans les dailyReports
  const reportSessions = dailyReports
    .find(report => report.date === date)
    ?.sessions || [];
  
  // 2. Compléter avec les sessions qui n'ont pas de rapport
  const otherSessions = allSessions.filter(
    session => session.day === date &&
      !reportSessions.some(rs => rs.id === session.id)
  );
  
  return [...reportSessions, ...otherSessions];
}

export const getDailyRoomOccupations = (
  date: string,
  rooms: Room[],
  sessions: Session[],
  dailyReports: DailyReport[]
) => {
  const daySessions = getDaySessions(date, sessions, dailyReports);
  
  return rooms.map(room => ({
    room,
    sessions: daySessions.filter(s => s.room === room.name)
  }));
};

export function groupSessionsByRoom(sessions: Session[]) {
  return sessions.reduce((acc, session) => {
    if (!acc[session.room]) {
      acc[session.room] = [];
    }
    acc[session.room].push(session);
    return acc;
  }, {} as Record<string, Session[]>);
}

export default {
  getDaySessions,
  getDailyRoomOccupations
};