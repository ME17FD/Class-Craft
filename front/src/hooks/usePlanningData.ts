import { useState, useEffect } from "react";
import api from "../services/api";
import { Room } from "../types/schedule";

export const usePlanningData = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanningData = async () => {
    try {
      setLoading(true);
      const [roomsResponse, reservationsResponse] = await Promise.all([
        api.get("/api/classrooms"),
        api.get("/api/reservations?include=subModule,subModule.teacher,group")
      ]);

      setRooms(roomsResponse.data);
      setReservations(reservationsResponse.data);
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

  const updatePresence = async (reservationId: number, wasAttended: boolean) => {
    try {
      await api.put(`/api/reservations/${reservationId}/mark-attended`, {
        wasAttended
      });
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, wasAttended }
            : reservation
        )
      );
    } catch (err) {
      console.error("Failed to update presence:", err);
      throw err;
    }
  };

  return {
    rooms,
    reservations,
    loading,
    error,
    updatePresence,
    refreshData: fetchPlanningData
  };
};