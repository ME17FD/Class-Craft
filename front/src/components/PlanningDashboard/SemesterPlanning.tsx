import React from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { fr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { usePlanning } from "../../context/PlanningContext";
import { useApiData } from "../../hooks/useApiData";

import { CalendarEvent } from "../../types/schedule";

// Définir le type d'événement étendu avec resource

const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const SemesterPlanning: React.FC = () => {
  const { sessions } = usePlanning();
  const { rooms, groups, fields } = useApiData(); // Récupérer depuis useApiData au lieu de usePlanning
  const [currentView, setCurrentView] = React.useState(Views.MONTH);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [filterRoom, setFilterRoom] = React.useState<string>("all");
  const [filterGroup, setFilterGroup] = React.useState<string>("all");
  const [filterField, setFilterField] = React.useState<string>("all");

  // Convertir les sessions en événements pour le calendrier avec le bon typage
  const events: CalendarEvent[] = sessions.map((session) => ({
    id: session.id,
    title: `${session.subModule?.name || "Séance"} - ${
      session.group?.name || ""
    }`,
    start: new Date(session.day || session.startDateTime || new Date()),
    end: new Date(
      new Date(session.day || session.startDateTime || new Date()).setHours(
        new Date(
          session.day || session.startDateTime || new Date()
        ).getHours() + (session.duration || 2)
      )
    ),
    resource: {
      room: session.classroom,
      group: session.group,
      professor: session.professor,
      type: session.type,
      professorPresent: session.professorPresent,
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
      filterField === "all" ||
      event.resource.group?.filiereId?.toString() === filterField;

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
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        view={currentView}
        onView={(view) => setCurrentView(view)}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        culture="fr"
        messages={{
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          today: "Aujourd'hui",
          previous: "<",
          next: ">",
          agenda: "Agenda",
          date: "Date",
          time: "Heure",
          event: "Séance",
          noEventsInRange: "Aucune séance prévue.",
        }}
        eventPropGetter={(event: CalendarEvent) => {
          let backgroundColor = "#2196F3"; // Bleu par défaut
          if (event.resource.type === "EXAM") backgroundColor = "#F44336"; // Rouge pour les exams
          if (event.resource.type === "RATTRAPAGE") backgroundColor = "#FF9800"; // Orange pour rattrapages
          if (event.resource.professorPresent === false)
            backgroundColor = "#9E9E9E"; // Gris si prof absent

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
              {event.resource.professorPresent !== undefined && (
                <div>
                  Présence:{" "}
                  {event.resource.professorPresent ? "Confirmée" : "Absent"}
                </div>
              )}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default SemesterPlanning;
