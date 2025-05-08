import { Session } from "../../types/schedule";

type Props = {
  sessions: Session[];
};

const daysOfWeek = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export const WeekCalendar = ({ sessions }: Props) => {
  return (
    <div className="week-calendar">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Heure</th>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Exemple pour des créneaux horaires fixes */}
          {["08:00", "10:00", "14:00", "16:00"].map((time) => (
            <tr key={time}>
              <td>{time}</td>
              {daysOfWeek.map((day) => {
                const session = sessions.find(
                  (s) => s.day === day && s.startTime === time
                );
                return (
                  <td key={day} className="session-cell">
                    {session && (
                      <div className="session-card">
                        <div>{session.module?.name}</div>
                        <div>{session.professor.firstName}</div>
                        <div>{session.room}</div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeekCalendar;
