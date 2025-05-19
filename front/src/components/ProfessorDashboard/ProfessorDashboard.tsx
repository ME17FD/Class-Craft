import React, { useState } from "react";
import { useApiData } from "../../hooks/useApiData";
import ProfessorSessions from "./ProfessorSessions";
import ProfessorGroups from "./ProfessorGroups";
import styles from "../../styles/StudentDashboard.module.css";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProfessorDashboard = () => {
  // Récupération des données depuis le localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const { seances = [], groups = [], students = [] } = useApiData();

  // State pour gérer l'onglet actif
  const [activeTab, setActiveTab] = useState<"sessions" | "groups">("sessions");

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userDetails");
    navigate("/");
  };

  // Filtrer les sessions du professeur
  const professorSessions = seances.filter(
    (s) => s.professor?.id === userData.professorId
  );

  // Filtrer les groupes enseignés par le professeur
  const taughtGroups = groups.filter((g) =>
    professorSessions.some((s) => s.group?.id === g.id)
  );

  return (
    <div className={styles.container}>
      <button className={styles.logoutButton} onClick={handleLogout}>
        <FiLogOut className={styles.logoutIcon} size={22} />
      </button>
      <h1 className={styles.title}>Tableau de Bord Professeur</h1>

      <div className={styles.userInfo}>
        <h2>
          {userData.firstName} {userData.lastName}
        </h2>
        <p>
          Nombre de cours: {professorSessions.length} | Groupes:{" "}
          {taughtGroups.length}
        </p>
      </div>

      {/* Onglets de navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "sessions" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("sessions")}>
          Mes Séances
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "groups" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("groups")}>
          Mes Groupes
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className={styles.planingContainer}>
        {activeTab === "sessions" ? (
          <section className={styles.scheduleSection}>
            <ProfessorSessions sessions={professorSessions} />
          </section>
        ) : (
          <section className={styles.classmatesSection}>
            <ProfessorGroups
              groups={taughtGroups}
              students={students}
              sessions={professorSessions}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfessorDashboard;
