import React from "react";
import styles from "../../styles/PedagogicalDashboard-components/FieldsTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { Field } from "../../types/type";

interface FieldsTabProps {
  fields: Field[];
  onEdit: (field: Field) => void;
  onDelete: (field: Field) => void;
}

const FieldsTab: React.FC<FieldsTabProps> = ({ fields, onEdit, onDelete }) => {
  const columns = [
    { header: "Nom", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "Actions",
      render: (field: Field) => (
        <div className={styles.actions}>
          <Button variant="edit" onClick={() => onEdit(field)} small>
            Modifier
          </Button>
          <Button variant="delete" onClick={() => onDelete(field)} small>
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
          onClick={() => onEdit({ id: 0, name: "", description: "" })}>
          + Ajouter une filière
        </Button>
      </div>

      <Table
        data={fields}
        columns={columns}
        emptyMessage="Aucune filière trouvée"
      />
    </>
  );
};

export default FieldsTab;
