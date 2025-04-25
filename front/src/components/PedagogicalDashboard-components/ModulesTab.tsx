import React from "react";
import styles from "../../styles/PedagogicalDashboard-components/ModulesTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { Module, Field } from "../../types/type";

interface ModulesTabProps {
  modules: Module[];
  fields: Field[];
  onEdit: (module: Module) => void;
  onDelete: (module: Module) => void;
}

const ModulesTab: React.FC<ModulesTabProps> = ({
  modules,
  fields,
  onEdit,
  onDelete,
}) => {
  const getFieldName = (fieldId: number) => {
    return fields.find((f) => f.id === fieldId)?.name || "Non spécifié";
  };

  const columns = [
    { header: "Nom", accessor: "name" },
    { header: "Code", accessor: "code" },
    {
      header: "Filière",
      render: (module: Module) => getFieldName(module.fieldId),
    },
    {
      header: "Actions",
      render: (module: Module) => (
        <div className={styles.actions}>
          <Button variant="edit" onClick={() => onEdit(module)} small>
            Modifier
          </Button>
          <Button variant="delete" onClick={() => onDelete(module)} small>
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
          onClick={() => onEdit({ id: 0, name: "", code: "", fieldId: 0 })}>
          + Ajouter un module
        </Button>
      </div>

      <Table
        data={modules}
        columns={columns}
        emptyMessage="Aucun module trouvé"
      />
    </>
  );
};

export default ModulesTab;
