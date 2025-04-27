import React, { useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/StudentTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { Student, Group } from "../../types/type";
import StudentFormModal from "./StudentFormModal";

interface StudentsTabProps {
  students: Student[];
  groups: Group[];
  onSaveStudent: (student: Student) => void;
}

const StudentsTab: React.FC<StudentsTabProps> = ({
  students,
  groups,
  onSaveStudent,
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    student: Student | null;
  }>({ isOpen: false, student: null });

  const getGroupName = (groupId: number | null) => {
    if (!groupId) return "Non affecté";
    const group = groups.find((g) => g.id === groupId);
    return group?.name || "Inconnu";
  };

  const handleOpenAddModal = () => {
    setModalState({
      isOpen: true,
      student: {
        id: 0,
        cne: "",
        apogee: "",
        lastName: "",
        firstName: "",
        groupId: null,
      },
    });
  };

  const handleOpenEditModal = (student: Student) => {
    setModalState({ isOpen: true, student });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, student: null });
  };

  const handleSave = (studentData: Omit<Student, "id">) => {
    onSaveStudent({
      ...studentData,
      id: modalState.student?.id || 0,
    });
    handleCloseModal();
  };

  const columns = [
    { header: "CNE", accessor: "cne" },
    { header: "Apogée", accessor: "apogee" },
    { header: "Nom", accessor: "lastName" },
    { header: "Prénom", accessor: "firstName" },
    {
      header: "Groupe",
      render: (student: Student) => getGroupName(student.groupId),
    },
    {
      header: "Actions",
      render: (student: Student) => (
        <Button
          variant="edit"
          onClick={() => handleOpenEditModal(student)}
          small>
          Modifier
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="primary" onClick={handleOpenAddModal}>
          + Ajouter un étudiant
        </Button>
      </div>

      <Table
        data={students}
        columns={columns}
        emptyMessage="Aucun étudiant trouvé"
      />

      {modalState.isOpen && modalState.student && (
        <StudentFormModal
          student={modalState.student}
          groups={groups}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default StudentsTab;
