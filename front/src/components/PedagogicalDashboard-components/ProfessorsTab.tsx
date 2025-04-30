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

  const getModuleNames = (moduleIds: number[] | undefined) => {
    if (!moduleIds || !modules) return "Aucun";
    return moduleIds
      .map((id) => modules.find((m) => m.id === id)?.name || "Inconnu")
      .join(", ");
  };

  const getSubModuleNames = (subModuleIds: number[] | undefined) => {
    if (!subModuleIds || !subModules) return "Aucun";
    return subModuleIds
      .map((id) => subModules.find((sm) => sm.id === id)?.name || "Inconnu")
      .join(", ");
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
    { header: "Nom", accessor: "name" as keyof Professor },
    { header: "Email", accessor: "email" as keyof Professor },
    {
      header: "Modules enseignés",
      render: (professor: Professor) =>
        getModuleNames(professor.modules) || "Aucun",
    },
    {
      header: "Sous-modules enseignés",
      render: (professor: Professor) =>
        getSubModuleNames(professor.subModules) || "Aucun",
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
              name: "",
              email: "",
              modules: [],
              subModules: [],
            })
          }>
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
        entityName={selectedProfessor?.name || "cet enseignant"}
      />
    </>
  );
};

export default ProfessorsTab;
