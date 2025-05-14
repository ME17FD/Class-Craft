import React, { useEffect, useState } from "react";
import { usePlanningData } from "../../hooks/usePlanningData";
import { format, parse, isSameDay, addDays, startOfDay, endOfDay } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Classroom, Reservation } from "../../types/type";
import styles from "../../styles/PlanningDashboard/DailyRoomsOccupation.module.css";

// Helper function to get hourly time slots (example: every hour)
const getTimeSlots = (startOfWeek: Date, endOfWeek: Date) => {
  let timeSlots = [];
  let currentTime = startOfDay(startOfWeek);
  while (currentTime <= endOfWeek) {
    timeSlots.push(format(currentTime, "HH:mm"));
    currentTime = addDays(currentTime, 1);
  }
  return timeSlots;
};

// Helper function to check if a reservation overlaps with a time slot
const isReservationDuringTimeSlot = (reservation: Reservation, timeSlot: string) => {
  const reservationStart = new Date(reservation.startDateTime);
  const reservationEnd = new Date(reservation.endDateTime);
  const slotStart = parse(timeSlot, "HH:mm", new Date());
  const slotEnd = addDays(slotStart, 1);

  return reservationStart <= slotEnd && reservationEnd >= slotStart;
};

const WeeklyRoomsOccupation: React.FC = () => {
  const { classrooms, reservations, loading, error } = usePlanningData();
  const [weekReservations, setWeekReservations] = useState<Reservation[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    // Set the time slots for the current week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Adjust to start of the week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to Saturday

    setTimeSlots(getTimeSlots(startOfWeek, endOfWeek));

    // Filter reservations for the current week
    const filteredReservations = reservations.filter((reservation) => {
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

      {/* Table with classrooms and their reservation status */}
      <div className={styles["rooms-table-container"]}>
        <table className={styles["rooms-table"]}>
          <thead>
            <tr>
              <th>Classrooms</th>
              {timeSlots.map((slot) => (
                <th key={slot}>{slot}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classrooms.map((classroom) => {
              return (
                <tr key={classroom.id}>
                  <td>{classroom.name}</td>
                  {timeSlots.map((slot) => {
                    const reservation = weekReservations.find((reservation) =>
                      reservation.classroomId === classroom.id &&
                      isReservationDuringTimeSlot(reservation, slot)
                    );

                    return (
                      <td key={slot}>
                        {reservation ? (
                          <div>
                            <strong>Group: {reservation.groupId}</strong>
                            <br />
                            SubModule: {reservation.subModuleId}
                          </div>
                        ) : (
                          <span>(empty)</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FullCalendar for weekly overview */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        events={weekReservations.map((reservation) => ({
          title: `Group ${reservation.groupId} | SubModule ${reservation.subModuleId}`,
          start: reservation.startDateTime,
          end: reservation.endDateTime,
          description: `Group: ${reservation.groupId} | SubModule: ${reservation.subModuleId}`,
        }))}
        eventClick={(info) => {
          alert(`Event clicked: ${info.event.title}\nDetails: ${info.event.extendedProps.description}`);
        }}
      />
    </div>
  );
};

export default WeeklyRoomsOccupation;
