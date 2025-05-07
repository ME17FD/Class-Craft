import React, { useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/ProfessorsTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { Professor, Module, SubModule } from "../../types/type";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface ProfessorsTabProps {
  professors: Professor[];
  modules: Module[];
  subModules: SubModule[];
  onEdit: (professor: Professor) => void;
  onDelete: (professor: Professor) => void;
}

const ProfessorsTab: React.FC<ProfessorsTabProps> = ({
  professors = [],
  modules = [],
  subModules = [],
  onEdit,
  onDelete,
}) => {
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getModuleNames = (professorModules: Module[] | undefined) => {
    if (!professorModules || professorModules.length === 0) return "Aucun";
    return professorModules.map(m => m.name).join(", ");
  };

  const getSubModuleNames = (professorSubModules: SubModule[] | undefined) => {
    if (!professorSubModules || professorSubModules.length === 0) return "Aucun";
    return professorSubModules.map(sm => sm.name).join(", ");
  };

  const handleDeleteClick = (professor: Professor) => {
    setSelectedProfessor(professor);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProfessor) {
      onDelete(selectedProfessor);
      setIsDeleteModalOpen(false);
      setSelectedProfessor(null);
    }
  };

  const columns = [
    {
      header: "Nom",
      render: (professor: Professor) => `${professor.firstName} ${professor.lastName}`,
    },
    { header: "Email", accessor: "email" as keyof Professor },
    {
      header: "Modules enseignés",
      render: (professor: Professor) => getModuleNames(professor.modules),
    },
    {
      header: "Sous-modules enseignés",
      render: (professor: Professor) => getSubModuleNames(professor.subModules),
    },
    {
      header: "Actions",
      render: (professor: Professor) => (
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onEdit(professor)}>
            Modifier
          </Button>
          <Button variant="delete" onClick={() => handleDeleteClick(professor)}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={styles.header}>
        <Button
          variant="primary"
          onClick={() =>
            onEdit({
              id: 0,
              firstName: "",
              lastName: "",
              email: "",
              modules: [],
              subModules: [],
            })
          }
        >
          + Ajouter un enseignant
        </Button>
      </div>

      <Table
        data={professors}
        columns={columns}
        emptyMessage="Aucun enseignant trouvé"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityName={
          selectedProfessor
            ? `${selectedProfessor.lastName} ${selectedProfessor.firstName}`
            : "cet enseignant"
        }
      />
    </>
  );
};

export default ProfessorsTab;