import React, { useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/SubModulesTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { SubModule, Module, Field, Professor } from "../../types/type";
import SubModuleFormModal from "./SubModuleFormModal";

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

  const getModuleName = (moduleId: number) => {
    if (!modules || modules.length === 0) return "Non spécifié";
    return modules.find((m) => m.id === moduleId)?.name || "Non spécifié";
  };

  const getFieldName = (moduleId: number) => {
    if (!modules || modules.length === 0 || !fields || fields.length === 0) return "Non spécifié";
    
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return "Non spécifié";
    
    const field = fields.find((f) => f.id === module.fieldId);
    return field?.name || "Non spécifié";
  };

  const getProfessorNames = (subModuleId: number) => {
    if (!subModules || !professors || professors.length === 0) return "Aucun professeur";
    
    const subModule = subModules.find(sm => sm.id === subModuleId);
    if (!subModule) return "Aucun professeur";
    
    const moduleProfessors = professors.filter(p => p.subModules && p.subModules.includes(subModuleId));
    return moduleProfessors.map(p => p.name).join(", ") || "Aucun professeur";
  };

  const columns = [
    { header: "Nom", accessor: "name" as keyof SubModule },
    { header: "Heures", accessor: "hours" as keyof SubModule },
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
          <Button variant="edit" onClick={() => onEdit(subModule)} small>
            Modifier
          </Button>
          <Button variant="delete" onClick={() => onDelete(subModule)} small>
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
            hours: subModuleData.hours || 0,
            moduleId: subModuleData.moduleId || 0
          };
          onEdit(newSubModule);
          setIsModalOpen(false);
        }}
        modules={modules}
        fields={fields}
      />
    </>
  );
};

export default SubModulesTab;
