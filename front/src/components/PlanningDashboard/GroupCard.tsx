// GroupCard.tsx
import { useState } from "react";
import { Session } from "../../types/schedule";
import { Group } from "../../types/type";
import { GroupFormModal } from "./GroupFromModal";
import { ConfirmationModal } from "./ConfirmationModal";
import styles from "../../styles/PlanningDashboard/GroupCard.module.css";

type GroupCardProps = {
  group: Group;
  sessions: Session[];
  onEdit: (updatedGroup: Group) => void;
  onDelete: () => void;
  onOpenSchedule: () => void;
};

export const GroupCard = ({
  group,
  sessions,
  onEdit,
  onDelete,
  onOpenSchedule,
}: GroupCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <>
      <div className={styles.groupCard} onClick={onOpenSchedule}>
        <div className={styles.cardActions}>
          <button
            className={styles.editButton}
            onClick={(e) => handleAction(e, () => setShowEditModal(true))}
            aria-label="Modifier">
            {/* Icône SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <button
            className={styles.deleteButton}
            onClick={(e) => handleAction(e, () => setShowDeleteModal(true))}
            aria-label="Supprimer">
            {/* Icône SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className={styles.cardHeader}>
          <h3>{group.name}</h3>
          <div className={styles.sessionCount}>
            {sessions.length} séance{sessions.length > 1 ? "s" : ""} planifiée
            {sessions.length > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Modale d'édition */}
      <GroupFormModal
        show={showEditModal}
        group={group}
        onHide={() => setShowEditModal(false)}
        onSave={(updatedGroup) => {
          onEdit(updatedGroup);
          setShowEditModal(false);
        }}
      />

      {/* Modale de confirmation */}
      <ConfirmationModal
        show={showDeleteModal}
        title="Supprimer le groupe"
        message={`Êtes-vous sûr de vouloir supprimer le groupe "${group.name}" ?`}
        onConfirm={() => {
          onDelete();
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};
