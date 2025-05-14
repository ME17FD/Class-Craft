import { useState, useEffect } from "react";
import api from "../services/api";
import { Classroom, Reservation, Group, SubModule } from "../types/type";  // Assuming these types exist in your types file

export const usePlanningData = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [subModules, setSubModules] = useState<SubModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanningData = async () => {
    try {
      setLoading(true);
      const [
        classroomsResponse,
        reservationsResponse,
        groupsResponse,
        subModulesResponse,
      ] = await Promise.all([
        api.get("/api/classrooms"),
        api.get("/api/reservations?include=subModule,subModule.teacher,group"),
        api.get("/api/groups"), // Fetch groups if needed
        api.get("/api/submodules"), // Fetch submodules if needed
      ]);

      setClassrooms(classroomsResponse.data);
      setReservations(reservationsResponse.data);
      setGroups(groupsResponse.data); // Assuming you have this endpoint
      setSubModules(subModulesResponse.data); // Assuming you have this endpoint
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
        wasAttended,
      });
      setReservations((prev) =>
        prev.map((reservation) =>
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
    classrooms,
    reservations,
    groups,
    subModules,
    loading,
    error,
    updatePresence,
    refreshData: fetchPlanningData,
  };
};
