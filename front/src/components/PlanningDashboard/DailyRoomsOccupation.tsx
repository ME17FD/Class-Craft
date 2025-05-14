import React, { useEffect, useState } from "react";
import { usePlanningData } from "../../hooks/usePlanningData";
import { format, parse, isSameDay } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Room } from "../../types/schedule";
import { Reservation } from "../../types/type";
import styles from "../../styles/PlanningDashboard/DailyRoomsOccupation.module.css";

// Helper function to convert reservations into FullCalendar events
const convertReservationsToEvents = (reservations: Reservation[]) => {
  return reservations.map(reservation => ({
    title: reservation.subModule?.name || "Réservation",
    start: reservation.startDateTime,
    end: reservation.endDateTime,
    description: `Salle: ${reservation.classroom?.name} | Groupe: ${reservation.group?.name || "Inconnu"}`,
    extendedProps: {
      professor: reservation.subModule?.professor?.firstName + " " + reservation.subModule?.professor?.lastName,
      group: reservation.group?.name,
      classroom: reservation.classroom?.name,
    },
  }));
};

const WeeklyRoomsOccupation: React.FC = () => {
  const { rooms, reservations, loading, error } = usePlanningData();

  const [weekReservations, setWeekReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    // This will filter reservations for the current week (or any specific week)
    const filteredReservations = reservations.filter(reservation => {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Adjust to start of week (Sunday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to Saturday

      const reservationStart = new Date(reservation.startDateTime);
      return reservationStart >= startOfWeek && reservationStart <= endOfWeek;
    });

    setWeekReservations(filteredReservations);
  }, [reservations]);

  if (loading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles["loading-spinner"]}></div>
        <p>Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["error-container"]}>
        <p className={styles["error-message"]}>{error}</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  return (
    <div className={styles["weekly-rooms-planning"]}>
      <h1>Planning hebdomadaire - Occupation des salles</h1>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        events={convertReservationsToEvents(weekReservations)} // Populate events with reservations data
        eventClick={(info) => {
          alert(`Event clicked: ${info.event.title}\nDetails: ${info.event.extendedProps.description}`);
        }}
        eventContent={(eventInfo) => (
          <div>
            <strong>{eventInfo.event.title}</strong>
            <br />
            <span>{eventInfo.event.extendedProps.professor}</span>
            <br />
            <span>{eventInfo.event.extendedProps.classroom}</span>
            <br />
            <span>{eventInfo.event.extendedProps.group}</span>
          </div>
        )}
      />
    </div>
  );
};

export default WeeklyRoomsOccupation;
