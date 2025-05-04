import React, { useState } from "react";
import { useStaticData } from "../../hooks/useStaticData";
import { GroupCard } from "./GroupCard";
import { GroupScheduleModal } from "./GroupScheduleModal";
import { GroupFormModal } from "./GroupFromModal"; // Correction de l'orthographe
import { ConfirmationModal } from "./ConfirmationModal";
import styles from "../../styles/PlanningDashboard/PlanningGroup.module.css";
import { Group, Professor, Field } from "../../types/type";
import { Room, Session } from "../../types/schedule";

export const GroupPlanning = () => {
  const {
    groups,
    sessions,
    rooms,
    professors,
    fields,
    addGroup,
    updateGroup,
    deleteGroup,
    addSession,
    updateSession,
  } = useStaticData();

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(
    null
  );
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const filteredGroups = groups.filter((group) => {
    const matchesField = selectedField
      ? group.filiereId === selectedField
      : true;
    const matchesSearch = group.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesProfessor = selectedProfessor
      ? sessions.some(
          (s) => s.group.id === group.id && s.professor.id === selectedProfessor
        )
      : true;
    const matchesRoom = selectedRoom
      ? sessions.some((s) => s.group.id === group.id && s.room === selectedRoom)
      : true;

    return matchesField && matchesSearch && matchesProfessor && matchesRoom;
  });

  const handleSaveGroup = (group: Group) => {
    if (group.id) {
      updateGroup(group);
    } else {
      addGroup(group);
    }
    setEditingGroup(null);
  };

  const handleSaveSession = (session: Session) => {
    if (session.id) {
      updateSession(session);
    } else {
      addSession(session);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Rechercher un groupe..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className={styles.filterSelect}
          value={selectedField ?? ""}
          onChange={(e) =>
            setSelectedField(e.target.value ? Number(e.target.value) : null)
          }>
          <option value="">Toutes les filières</option>
          {fields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.name}
            </option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={selectedProfessor ?? ""}
          onChange={(e) =>
            setSelectedProfessor(e.target.value ? Number(e.target.value) : null)
          }>
          <option value="">Tous les professeurs</option>
          {professors.map((prof) => (
            <option key={prof.id} value={prof.id}>
              {prof.name}
            </option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={selectedRoom ?? ""}
          onChange={(e) => setSelectedRoom(e.target.value || null)}>
          <option value="">Toutes les salles</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.name}>
              {room.name}
            </option>
          ))}
        </select>

        <button
          className={styles.addButton}
          onClick={() =>
            setEditingGroup({
              id: 0,
              name: "",
              filiereId: 1,
              students: [],
            })
          }>
          + Nouveau groupe
        </button>
      </div>

      <div className={styles.groupsGrid}>
        {filteredGroups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            sessions={sessions.filter((s) => s.group.id === group.id)}
            onOpenSchedule={() => setSelectedGroup(group)}
            onEdit={() => setEditingGroup(group)}
            onDelete={() => setDeletingGroup(group)}
          />
        ))}
      </div>

      <GroupScheduleModal
        group={selectedGroup}
        sessions={sessions}
        onClose={() => setSelectedGroup(null)}
      />

      <GroupFormModal
        show={!!editingGroup}
        group={editingGroup}
        onHide={() => setEditingGroup(null)}
        onSave={handleSaveGroup}
        onSaveSession={handleSaveSession}
      />

      <ConfirmationModal
        show={!!deletingGroup}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer le groupe "${deletingGroup?.name}" ?`}
        onConfirm={() => {
          if (deletingGroup) {
            deleteGroup(deletingGroup.id);
            setDeletingGroup(null);
          }
        }}
        onCancel={() => setDeletingGroup(null)}
      />
    </div>
  );
};

export default GroupPlanning;
