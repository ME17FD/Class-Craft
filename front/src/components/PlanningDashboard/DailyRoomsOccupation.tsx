import React, { useEffect } from "react";
import { usePlanning } from "../../context/PlanningContext";
import styles from "../../styles/PlanningDashboard/DailyRoomsOccupation.module.css";
import { usePlanningData } from "../../hooks/usePlanningData";
import { format, parse, isSameDay } from "date-fns";
import { Room } from "../../types/schedule";
import { Professor, SubModule, Group } from "../../types/type";

interface Reservation {
  id: number;
  startDateTime: string;
  endDateTime: string;
  wasAttended: boolean;
  subModuleId: number;
  groupId: number;
  classroomId: number;
  subModule?: SubModule & { professor?: Professor };
  group?: Group;
  classroom?: Room;
}

interface DailyRoomsOccupationProps {
  date: string;
}

const timeSlots = [
  { start: "08:00", end: "10:00", label: "08:00-10:00" },
  { start: "10:15", end: "12:15", label: "10:15-12:15" },
  { start: "13:00", end: "15:00", label: "13:00-15:00" },
  { start: "15:15", end: "17:15", label: "15:15-17:15" },
] as const;

const DailyRoomsOccupation: React.FC<DailyRoomsOccupationProps> = ({ date }) => {
  const { rooms, reservations, loading, error, updatePresence } = usePlanningData();
  const selectedDate = new Date(date);

  useEffect(() => {
    console.log("Current reservations:", reservations);
    console.log("Selected date:", date);
    console.log("Rooms data:", rooms);
  }, [reservations, date, rooms]);

  const dayReservations = React.useMemo(() => {
    const filtered = reservations.filter(reservation =>
      isSameDay(new Date(reservation.startDateTime), selectedDate)
    );
    console.log("Filtered reservations for date:", date, filtered);
    return filtered;
  }, [reservations, date]);

  const isReservationInTimeSlot = (reservation: Reservation, slotStart: string, slotEnd: string): boolean => {
    const parseTime = (time: string): number => parse(time, 'HH:mm', new Date()).getTime();

    const slotStartTime = parseTime(slotStart);
    const slotEndTime = parseTime(slotEnd);

    const reservationStart = format(new Date(reservation.startDateTime), 'HH:mm');
    const reservationEnd = format(new Date(reservation.endDateTime), 'HH:mm');

    const resStartTime = parseTime(reservationStart);
    const resEndTime = parseTime(reservationEnd);

    const isInSlot = (
      (resStartTime >= slotStartTime && resStartTime < slotEndTime) ||
      (resEndTime > slotStartTime && resEndTime <= slotEndTime) ||
      (resStartTime <= slotStartTime && resEndTime >= slotEndTime)
    );

    console.log(`Checking reservation ${reservation.id} (${reservationStart}-${reservationEnd}) against slot ${slotStart}-${slotEnd}:`, isInSlot);
    return isInSlot;
  };

  const getReservationStatus = (reservation: Reservation | null): 'empty' | 'absent' | 'occupied' => {
    if (!reservation) return 'empty';
    if (reservation.wasAttended === false) return 'absent';
    return 'occupied';
  };

  const handlePresenceChange = async (reservationId: number, currentValue: boolean) => {
    console.log("Updating presence for reservation:", reservationId, "from", currentValue, "to", !currentValue);
    try {
      await updatePresence(reservationId, !currentValue);
      console.log("Presence updated successfully");
    } catch (err) {
      console.error("Failed to update presence:", err);
      alert("Failed to update presence. Check console for details.");
    }
  };

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

  if (!rooms || rooms.length === 0) {
    return (
      <div className={styles["empty-state"]}>
        <p>Aucune salle n'est disponible.</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  return (
    <div className={styles["daily-rooms-planning"]}>
      <h1>Planning journalier - Occupation des salles</h1>
      <h2>{format(selectedDate, 'dd MMMM yyyy')}</h2>

      <div className={styles["debug-info"]}>
        <p>Showing {dayReservations.length} reservations for this date</p>
        <button onClick={() => console.log("Current state:", { rooms, reservations, dayReservations })}>
          Log Current State
        </button>
      </div>

      <div className={styles["planning-grid"]}>
        <div className={`${styles["grid-row"]} ${styles["header"]}`}>
          <div className={`${styles["room-cell"]} ${styles["header-cell"]}`}>SALLE</div>
          {timeSlots.map((slot) => (
            <div key={slot.label} className={`${styles["time-slot-cell"]} ${styles["header-cell"]}`}>
              {slot.label}
            </div>
          ))}
        </div>

        {rooms.map((room) => (
          <div key={room.id} className={styles["grid-row"]}>
            <div className={styles["room-cell"]}>
              {room.name}
              <div className={styles["room-info"]}>
                {room.capacity} places • {room.type || 'Non spécifié'}
              </div>
            </div>

            {timeSlots.map((slot) => {
              const reservation = dayReservations.find(
                (r) =>
                  r.classroomId === room.id &&
                  isReservationInTimeSlot(r, slot.start, slot.end)
              );

              const status = getReservationStatus(reservation || null);

              return (
                <div
                  key={`${room.id}-${slot.start}`}
                  className={`${styles["session-cell"]} ${styles[status]}`}
                  data-testid={`cell-${room.id}-${slot.start.replace(':', '')}`}
                >
                  {reservation ? (
                    <div className={styles["session-content"]}>
                      <div className={styles["session-title"]}>
                        {reservation.subModule?.name || "Réservation"}
                      </div>
                      {reservation.subModule?.professor && (
                        <div className={styles["session-professor"]}>
                          {reservation.subModule.professor.firstName} {reservation.subModule.professor.lastName}
                        </div>
                      )}
                      <div className={styles["session-details"]}>
                        {reservation.group?.name
                          ? `Groupe ${reservation.group.name}`
                          : `Groupe ID: ${reservation.groupId}`}
                      </div>
                      <label className={styles["checkbox-label"]}>
                        <input
                          type="checkbox"
                          checked={reservation.wasAttended}
                          onChange={() => handlePresenceChange(reservation.id, reservation.wasAttended)}
                          data-testid={`checkbox-${reservation.id}`}
                        />
                        Prof. présent
                      </label>
                    </div>
                  ) : (
                    <div className={styles["empty-label"]}>Libre</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyRoomsOccupation;
