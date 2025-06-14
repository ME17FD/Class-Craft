import React from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useApiData } from "../../hooks/useApiData";
import { CalendarEvent } from "../../types/schedule";
import { usePlanningData } from "../../hooks/usePlanningData";

const locales = { fr };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const SemesterPlanning: React.FC = () => {
  const { rooms, groups, fields } = useApiData();
  const { reservations } = usePlanningData();
  const [currentView, setCurrentView] = React.useState(Views.MONTH);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [filterRoom, setFilterRoom] = React.useState<string>("all");
  const [filterGroup, setFilterGroup] = React.useState<string>("all");
  const [filterField, setFilterField] = React.useState<string>("all");

  // Convertir les réservations en événements pour le calendrier
  const events: CalendarEvent[] = reservations.map((reservation) => ({
    id: reservation.id,
    title: `${reservation.submodule?.name || "Réservation"} - ${
      reservation.group?.name || ""
    }`,
    start: new Date(reservation.startDateTime),
    end: new Date(reservation.endDateTime),
    resource: {
      room: reservation.classroom,
      group: reservation.group,
      professor: reservation.submodule?.professor,
      type: reservation?.type || "RESERVATION",
      wasAttended: reservation.wasAttended,
      fieldId: reservation.group?.filiereId?.toString(),
    },
  }));

  // Appliquer les filtres
  const filteredEvents = events.filter((event) => {
    const roomMatch =
      filterRoom === "all" || event.resource.room?.id.toString() === filterRoom;

    const groupMatch =
      filterGroup === "all" ||
      event.resource.group?.id.toString() === filterGroup;

    const fieldMatch =
      filterField === "all" || event.resource.fieldId === filterField;

    return roomMatch && groupMatch && fieldMatch;
  });

  return (
    <div style={{ height: "700px", padding: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}>
        {/* Filtre par filière */}
        <select
          value={filterField}
          onChange={(e) => setFilterField(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px" }}>
          <option value="all">Toutes les filières</option>
          {fields.map((field) => (
            <option key={field.id} value={field.id.toString()}>
              {field.name}
            </option>
          ))}
        </select>

        {/* Filtre par salle */}
        <select
          value={filterRoom}
          onChange={(e) => setFilterRoom(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px" }}>
          <option value="all">Toutes les salles</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id.toString()}>
              {room.name} (Capacité: {room.capacity})
            </option>
          ))}
        </select>

        {/* Filtre par groupe */}
        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px" }}>
          <option value="all">Tous les groupes</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id.toString()}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        view={currentView}
        onView={setCurrentView}
        date={currentDate}
        onNavigate={setCurrentDate}
        culture="fr"
        messages={{
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          today: "Aujourd'hui",
          previous: "Précédent",
          next: "Suivant",
          agenda: "Agenda",
          date: "Date",
          time: "Heure",
          event: "Réservation",
          noEventsInRange: "Aucune réservation prévue.",
        }}
        eventPropGetter={(event: CalendarEvent) => {
          let backgroundColor = "#2196F3"; // Bleu par défaut
          if (event.resource.type === "EXAM") backgroundColor = "#F44336";
          if (event.resource.type === "TD") backgroundColor = "#3ccd5f";
          if (event.resource.type === "TP") backgroundColor = "#30a2b4";
          if (event.resource.type === "RATTRAPAGE") backgroundColor = "#f15f0c";
          if (event.resource.type === "EVENT") backgroundColor = "#721b84";
          if (event.resource.type === "EXAM") backgroundColor = "#e71d1d";
          if (!event.resource.wasAttended) backgroundColor = "#9E9E9E";

          return { style: { backgroundColor } };
        }}
        components={{
          event: ({ event }: { event: CalendarEvent }) => (
            <div style={{ padding: "5px" }}>
              <strong>{event.title}</strong>
              <div>Type: {event.resource.type}</div>
              {event.resource.room && (
                <div>Salle: {event.resource.room.name}</div>
              )}
              {event.resource.professor && (
                <div>
                  Professeur: {event.resource.professor.firstName}{" "}
                  {event.resource.professor.lastName}
                </div>
              )}
              <div>
                {event.start.toLocaleTimeString()} -{" "}
                {event.end.toLocaleTimeString()}
              </div>
              <div>
                Statut:{" "}
                {event.resource.wasAttended ? "Effectuée" : "Non effectuée"}
              </div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default SemesterPlanning;
