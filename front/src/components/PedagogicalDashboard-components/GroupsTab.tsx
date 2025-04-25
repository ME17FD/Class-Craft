import React, { useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/GroupsTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { Group, Field, Student } from "../../types/type";
import GroupFormModal from "./GroupFormModal";
import StudentListModal from "./StudentListModal";
import AddStudentModal from "./AddStudentModal";

interface GroupsTabProps {
  groups: Group[];
  fields: Field[];
  onSaveGroup: (group: Group) => void;
  onDeleteGroup: (groupId: number) => void;
  onAddStudent: (groupId: number, student: Omit<Student, "id">) => void;
  onRemoveStudent: (groupId: number, studentId: number) => void;
}

const GroupsTab: React.FC<GroupsTabProps> = ({
  groups,
  fields,
  onSaveGroup,
  onDeleteGroup,
  onAddStudent,
  onRemoveStudent,
}) => {
  const [modalState, setModalState] = useState<{
    type: "group-form" | "student-list" | "add-student" | null;
    groupId: number | null;
  }>({ type: null, groupId: null });

  const getFieldName = (fieldId: number) => {
    return fields.find((f) => f.id === fieldId)?.name || "Non spécifié";
  };

  const handleOpenGroupForm = (group?: Group) => {
    setModalState({
      type: "group-form",
      groupId: group?.id || null,
    });
  };

  const handleOpenStudentList = (groupId: number) => {
    setModalState({
      type: "student-list",
      groupId,
    });
  };

  const handleOpenAddStudent = (groupId: number) => {
    setModalState({
      type: "add-student",
      groupId,
    });
  };

  const handleCloseModal = () => {
    setModalState({ type: null, groupId: null });
  };

  const currentGroup =
    modalState.groupId !== null
      ? groups.find((g) => g.id === modalState.groupId)
      : null;

  const columns = [
    { header: "Nom", accessor: "name" },
    {
      header: "Filière",
      render: (group: Group) => getFieldName(group.fieldId),
    },
    {
      header: "Nombre d'étudiants",
      render: (group: Group) => group.students.length,
    },
    {
      header: "Actions",
      render: (group: Group) => (
        <div className={styles.actions}>
          <Button
            variant="assign"
            onClick={() => handleOpenStudentList(group.id)}
            small>
            Étudiants
          </Button>
          <Button
            variant="delete"
            onClick={() => onDeleteGroup(group.id)}
            small>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="primary" onClick={() => handleOpenGroupForm()}>
          + Ajouter un groupe
        </Button>
      </div>

      <Table
        data={groups}
        columns={columns}
        emptyMessage="Aucun groupe trouvé"
      />

      {/* Modal pour créer/modifier un groupe */}
      {modalState.type === "group-form" && (
        <GroupFormModal
          group={currentGroup || undefined}
          fields={fields}
          onSave={(groupData) => {
            onSaveGroup({
              ...groupData,
              id: modalState.groupId || 0,
              students: currentGroup?.students || [],
            });
            handleCloseModal();
          }}
          onClose={handleCloseModal}
        />
      )}

      {/* Modal pour voir les étudiants du groupe */}
      {modalState.type === "student-list" && currentGroup && (
        <StudentListModal
          group={currentGroup}
          onAddStudent={() => handleOpenAddStudent(currentGroup.id)}
          onRemoveStudent={(studentId) => {
            onRemoveStudent(currentGroup.id, studentId);
          }}
          onClose={handleCloseModal}
        />
      )}

      {/* Modal pour ajouter un étudiant */}
      {modalState.type === "add-student" && currentGroup && (
        <AddStudentModal
          onSave={(studentData) => {
            onAddStudent(currentGroup.id, studentData);
            handleCloseModal();
          }}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default GroupsTab;
