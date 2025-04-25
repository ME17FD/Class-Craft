import React from "react";
import styles from "../../styles/PedagogicalDashboard-components/SubModulesTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { SubModule, Module } from "../../types/type";

interface SubModulesTabProps {
  subModules: SubModule[];
  modules: Module[];
  onEdit: (subModule: SubModule) => void;
  onDelete: (subModule: SubModule) => void;
}

const SubModulesTab: React.FC<SubModulesTabProps> = ({
  subModules,
  modules,
  onEdit,
  onDelete,
}) => {
  const getModuleName = (moduleId: number) => {
    return modules.find((m) => m.id === moduleId)?.name || "Non spécifié";
  };

  const columns = [
    { header: "Nom", accessor: "name" },
    { header: "Heures", accessor: "hours" },
    {
      header: "Module parent",
      render: (subModule: SubModule) => getModuleName(subModule.moduleId),
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
          onClick={() => onEdit({ id: 0, name: "", hours: 0, moduleId: 0 })}>
          + Ajouter un sous-module
        </Button>
      </div>

      <Table
        data={subModules}
        columns={columns}
        emptyMessage="Aucun sous-module trouvé"
      />
    </>
  );
};

export default SubModulesTab;
