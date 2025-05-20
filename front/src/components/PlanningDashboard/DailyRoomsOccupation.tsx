import React, { useEffect } from "react";
import styles from "../../styles/PlanningDashboard/DailyRoomsOccupation.module.css";
import { usePlanningData } from "../../hooks/usePlanningData";
import { format, parse, isSameDay } from "date-fns";
import { Room } from "../../types/schedule";
import { Professor, SubModule, Group } from "../../types/type";
import * as XLSX from "xlsx";


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

const exportToExcel = () => {
  const workbook = XLSX.utils.book_new();
  const data: (string | number)[][] = [];

  // Header row
  data.push([
    "Salle",
    ...timeSlots.map(slot => slot.label),
    "Capacité"
  ]);

  rooms.forEach(room => {
    const row: (string | number)[] = [room.name];

    for (const slot of timeSlots) {
      const reservation = dayReservations.find(
        r => r.classroomId === room.id && isReservationInTimeSlot(r, slot.start, slot.end)
      );

      if (reservation) {
        const moduleName = reservation.submodule?.name || "N/A";
        const groupName = reservation.groupName || `ID: ${reservation.groupId}` || "N/A";
        const profName = reservation.submodule?.teacher
          ? `${reservation.submodule.teacher.firstName} ${reservation.submodule.teacher.lastName}`
          : "N/A";
        const presence = reservation.wasAttended === true
          ? "Présent"
          : reservation.wasAttended === false
          ? "Absent"
          : "N/A";

        // multiline text to force Excel auto row height
        const cellContent =
          `Module: ${moduleName}\n` +
          `Groupe: ${groupName}\n` +
          `Prof: ${profName}\n` +
          `Présence: ${presence}`;

        row.push(cellContent);
      } else {
        row.push("-"); // fill libre cells with "-"
      }
    }

    row.push(room.capacity);

    data.push(row);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Bold headers
  const range = XLSX.utils.decode_range(worksheet['!ref'] || "");
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!worksheet[cellAddress]) continue;
    if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
    worksheet[cellAddress].s.font = { bold: true };
  }

  // Wrap text & auto column width
  const colWidths = data[0].map((_, colIndex) => {
    let maxLength = 10;
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const cell = data[rowIndex][colIndex];
      if (cell) {
        const cellLines = String(cell).split("\n");
        const longestLineLength = cellLines.reduce((max, line) => Math.max(max, line.length), 0);
        maxLength = Math.max(maxLength, longestLineLength);
      }
    }
    return { wch: maxLength + 2 };
  });
  worksheet['!cols'] = colWidths;

  // Apply wrapText & vertical alignment top to all cells except header
  for (let R = 1; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      if (cell) {
        if (!cell.s) cell.s = {};
        if (!cell.s.alignment) cell.s.alignment = {};
        cell.s.alignment.wrapText = true;
        cell.s.alignment.vertical = "top";
      }
    }
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, `Occupation Salles`);

  XLSX.writeFile(workbook, `occupation-salles-${format(selectedDate, "yyyy-MM-dd")}.xlsx`);
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
        <button onClick={exportToExcel} style={{ marginLeft: '10px' }}>
          Export to Excel
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
                        {reservation.submodule?.name || "Réservation"}
                      </div>
                      {reservation.submodule?.teacher && (
                        <div className={styles["session-professor"]}>
                          Prof:  {reservation.submodule.teacher.firstName} {reservation.submodule.teacher.lastName}
                        </div>
                      )}
                      <div className={styles["session-details"]}>
                        {reservation.groupName
                          ? `Groupe ${reservation.groupName}`
                          : `Groupe ID: ${reservation.groupId}`}
                      </div>
                      <label className={styles["checkbox-label"]}>
                        Prof. présent:
                        <input
                          type="checkbox"
                          checked={reservation.wasAttended}
                          onChange={() => handlePresenceChange(reservation.id, reservation.wasAttended)}
                          data-testid={`checkbox-${reservation.id}`}
                        />
                        
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
