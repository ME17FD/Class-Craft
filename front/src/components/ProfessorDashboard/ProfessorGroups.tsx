import React, { useState, useMemo } from "react";
import { usePlanning } from "../../context/PlanningContext";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { Professor } from "../../types/type";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

interface ProfessorGroupsProps {
  professor?: Professor;
}

const ProfessorGroups: React.FC<ProfessorGroupsProps> = ({ professor }) => {
  const { sessions } = usePlanning();
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);

  // Vérification initiale des données
  if (!professor) {
    return (
      <div className={styles.emptyMessage}>
        Les informations du professeur ne sont pas disponibles
      </div>
    );
  }

  // Mémoization des données filtrées
  const { taughtGroups, groupSessions } = useMemo(() => {
    // Filtrer les sessions du professeur
    const profSessions = sessions.filter(
      (s) => s.professor?.id === professor.id || s.professorId === professor.id
    );

    // Extraire les groupes uniques
    const uniqueGroups: { id: number; name: string }[] = [];
    const groupMap = new Map<number, boolean>();

    profSessions.forEach((session) => {
      const group = session.group;
      if (group && !groupMap.has(group.id)) {
        groupMap.set(group.id, true);
        uniqueGroups.push(group);
      }
    });

    return {
      taughtGroups: uniqueGroups,
      groupSessions: profSessions,
    };
  }, [sessions, professor.id]);

  // Gestion de l'expansion des groupes
  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Cas où aucun groupe n'est trouvé
  if (taughtGroups.length === 0) {
    return (
      <div className={styles.emptyMessage}>
        {professor.firstName} {professor.lastName} n'enseigne dans aucun groupe
        actuellement
        {professor.modules?.length === 0 && (
          <p className={styles.noModules}>Aucun module attribué</p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          Groupes enseignés - {professor.firstName} {professor.lastName}
          {professor.grade && <span> ({professor.grade})</span>}
        </h2>

        {professor.specialty && (
          <p className={styles.specialty}>Spécialité: {professor.specialty}</p>
        )}
      </div>

      <div className={styles.groupsContainer}>
        {taughtGroups.map((group) => (
          <div key={group.id} className={styles.groupCard}>
            <div
              className={styles.cardHeader}
              onClick={() => toggleGroup(group.id)}>
              <h3>{group.name}</h3>
              <div className={styles.toggleIcon}>
                {expandedGroups.includes(group.id) ? (
                  <FiChevronDown />
                ) : (
                  <FiChevronRight />
                )}
              </div>
            </div>

            {expandedGroups.includes(group.id) && (
              <div className={styles.groupDetails}>
                <div className={styles.scheduleSection}>
                  <h4>Emploi du temps</h4>
                  {groupSessions
                    .filter((s) => s.group?.id === group.id)
                    .map((session) => (
                      <div key={session.id} className={styles.sessionPreview}>
                        <div className={styles.sessionTime}>
                          <span>{session.day || session.dayOfWeek}</span>
                          <span>
                            {session.startTime} - {session.endTime}
                          </span>
                        </div>
                        <div className={styles.sessionInfo}>
                          <span className={styles.module}>
                            {session.module?.name ||
                              session.subModule?.name ||
                              "Cours"}
                          </span>
                          {session.classroom?.name && (
                            <span className={styles.classroom}>
                              Salle: {session.classroom.name}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessorGroups;
