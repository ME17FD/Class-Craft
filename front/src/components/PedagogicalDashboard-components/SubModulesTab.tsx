import React, { useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/SubModulesTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { SubModule, Module, Field, Professor } from "../../types/type";
import SubModuleFormModal from "./SubModuleFormModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface SubModulesTabProps {
  subModules: SubModule[];
  modules: Module[];
  fields: Field[];
  professors: Professor[];
  onEdit: (subModule: SubModule) => void;
  onDelete: (subModule: SubModule) => void;
}

const SubModulesTab: React.FC<SubModulesTabProps> = ({
  subModules = [],
  modules = [],
  fields = [],
  professors = [],
  onEdit,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubModule, setSelectedSubModule] = useState<SubModule | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getModuleName = (moduleId: number) => {
    if (!modules || modules.length === 0) return "Non spécifié";
    return modules.find((m) => m.id === moduleId)?.name || "Non spécifié";
  };

  const getFieldName = (moduleId: number) => {
    if (!modules || modules.length === 0 || !fields || fields.length === 0) return "Non spécifié";
    
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return "Non spécifié";
    
    const field = fields.find((f) => f.id === module.filiereId);
    return field?.name || "Non spécifié";
  };

  const getProfessorNames = (subModuleId: number) => {
    if (!subModules || !professors || professors.length === 0) return "Aucun professeur";
    
    const subModule = subModules.find(sm => sm.id === subModuleId);
    if (!subModule) return "Aucun professeur";
    const moduleProfessors = professors.filter(p =>
      p.subModules && p.subModules.some(sm => sm === subModuleId)
    );
    return moduleProfessors.map(p => p.firstName + " " + p.lastName).join(", ") || "Aucun professeur";
  };

  const handleDeleteClick = (subModule: SubModule) => {
    setSelectedSubModule(subModule);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSubModule) {
      onDelete(selectedSubModule);
      setIsDeleteModalOpen(false);
      setSelectedSubModule(null);
    }
  };

  const columns = [
    { header: "Nom", accessor: "name" as keyof SubModule },
    { header: "Heures", accessor: "nbrHours" as keyof SubModule },
    {
      header: "Module parent",
      render: (subModule: SubModule) => getModuleName(subModule.moduleId),
    },
    {
      header: "Filière parente",
      render: (subModule: SubModule) => getFieldName(subModule.moduleId),
    },
    {
      header: "Professeur(s)",
      render: (subModule: SubModule) => getProfessorNames(subModule.id),
    },
    {
      header: "Actions",
      render: (subModule: SubModule) => (
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onEdit(subModule)}>
            Modifier
          </Button>
          <Button variant="delete" onClick={() => handleDeleteClick(subModule)}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}>
          + Ajouter un sous-module
        </Button>
      </div>

      <Table
        data={subModules}
        columns={columns}
        emptyMessage="Aucun sous-module trouvé"
      />

      <SubModuleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(subModuleData) => {
          // Assurez-vous que toutes les propriétés requises sont présentes
          const newSubModule: SubModule = {
            id: 0,
            name: subModuleData.name || "",
            nbrHours: subModuleData.nbrHours || 0,
            moduleId: subModuleData.moduleId || 0
          };
          onEdit(newSubModule);
          setIsModalOpen(false);
        }}
        modules={modules}
        fields={fields}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityName={selectedSubModule?.name || "ce sous-module"}
      />
    </div>
  );
};

export default SubModulesTab;
