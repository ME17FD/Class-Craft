import { useState, useEffect } from "react";
import api from "../services/api";
import { Room, Session } from "../types/schedule";
import { format } from "date-fns";

export const usePlanningData = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [seances, setSeances] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanningData = async () => {
    try {
      setLoading(true);
      const [roomsResponse, reservationsResponse] = await Promise.all([
        api.get("/api/classrooms"),
        api.get("/api/reservations")
      ]);

      setRooms(roomsResponse.data);
      
      // Map reservations to sessions format
      const mappedSessions: Session[] = reservationsResponse.data.map((reservation: any) => ({
        id: reservation.id,
        startTime: format(new Date(reservation.startDateTime), 'HH:mm'),
        endTime: format(new Date(reservation.endDateTime), 'HH:mm'),
        day: format(new Date(reservation.startDateTime), 'yyyy-MM-dd'),
        dayOfWeek: format(new Date(reservation.startDateTime), 'EEEE').toUpperCase(),
        professor: reservation.subModule?.teacher,
        module: reservation.subModule?.module,
        subModule: reservation.subModule,
        classroom: {
          id: reservation.classroomId,
          name: reservation.classroom?.name,
          capacity: reservation.classroom?.capacity,
          type: reservation.classroom?.type
        },
        group: reservation.group,
        type: 'CM', // Default type, adjust based on your needs
        professorPresent: reservation.wasAttended,
        duration: Math.ceil((new Date(reservation.endDateTime).getTime() - new Date(reservation.startDateTime).getTime()) / (1000 * 60 * 60))
      }));

      setSeances(mappedSessions);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch planning data:", err);
      setError("Failed to load planning data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanningData();
  }, []);

  const updatePresence = async (sessionId: number, wasAttended: boolean) => {
    try {
      await api.put(`/api/reservations/${sessionId}/mark-attended`);
      setSeances(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, professorPresent: wasAttended }
            : session
        )
      );
    } catch (err) {
      console.error("Failed to update presence:", err);
      throw err;
    }
  };

  return {
    rooms,
    seances,
    loading,
    error,
    updatePresence,
    refreshData: fetchPlanningData
  };
}; 