// pages/DailyReportsPage.tsx
import React from "react";
import DailyRoomsOccupation from "./DailyRoomsOccupation";
import { usePlanning } from "../../context/PlanningContext";
import { Room } from "../../types/schedule";

const DailyReportsPage: React.FC = () => {
  const { dailyReports } = usePlanning();
  const [selectedDate, setSelectedDate] = React.useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Simuler la récupération des salles (à remplacer par votre propre logique)
  const rooms: Room[] = [
    { id: 1, name: "AMPH11", capacity: 120, type: "Salle de cours" },
    { id: 2, name: "AMPH12", capacity: 100, type: "Salle de cours" },
    // Ajouter toutes les salles comme dans votre image
  ];

  return (
    <div className="daily-reports-page">
      <div className="date-selector">
        <label htmlFor="report-date">Date : </label>
        <input
          id="report-date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <DailyRoomsOccupation date={selectedDate} rooms={rooms} />
    </div>
  );
};

export default DailyReportsPage;
