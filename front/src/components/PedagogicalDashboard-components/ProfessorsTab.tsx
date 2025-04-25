import React from "react";
import styles from "../../styles/PedagogicalDashboard-components/ProfessorsTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { Professor, Module, SubModule } from "../../types/type";

interface ProfessorsTabProps {
  professors: Professor[];
  modules: Module[];
  subModules: SubModule[];
  onEdit: (professor: Professor) => void;
}

const ProfessorsTab: React.FC<ProfessorsTabProps> = ({
  professors,
  modules,
  subModules,
  onEdit,
}) => {
  const getModuleNames = (moduleIds: number[]) => {
    return moduleIds
      .map((id) => modules.find((m) => m.id === id)?.name || "Inconnu")
      .join(", ");
  };

  const getSubModuleNames = (subModuleIds: number[]) => {
    return subModuleIds
      .map((id) => subModules.find((sm) => sm.id === id)?.name || "Inconnu")
      .join(", ");
  };

  const columns = [
    { header: "Nom", accessor: "name" },
    { header: "Email", accessor: "email" },
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
        <Button variant="edit" onClick={() => onEdit(professor)} small>
          Modifier
        </Button>
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
    </>
  );
};

export default ProfessorsTab;
