import React, { useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/FieldsTab.module.css";
import Table from "./TableActions";
import Button from "./Button";
import { Field, Module, SubModule, Group, Professor } from "../../types/type";
import FieldDetailsModal from "./FieldDetailsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface FieldsTabProps {
  fields: Field[];
  modules: Module[];
  subModules: SubModule[];
  groups: Group[];
  professors: Professor[];
  onEdit: (field: Field) => void;
  onDelete: (field: Field) => void;
}

const FieldsTab: React.FC<FieldsTabProps> = ({
  fields,
  modules,
  subModules,
  groups,
  professors,
  onEdit,
  onDelete,
}) => {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDetails = (field: Field) => {
    setSelectedField(field);
  };

  const handleCloseDetails = () => {
    setSelectedField(null);
  };

  const handleDeleteClick = (field: Field) => {
    setSelectedField(field);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedField) {
      onDelete(selectedField);
      setIsDeleteModalOpen(false);
      setSelectedField(null);
    }
  };

  const columns = [
    { header: "Nom", accessor: "name" as keyof Field },
    { header: "Description", accessor: "description" as keyof Field },
    {
      header: "Actions",
      render: (field: Field) => (
        <div className={styles.actions}>
          <Button
            variant="primary"
            onClick={() => handleOpenDetails(field)}
            small>
            Détails
          </Button>
          <Button variant="secondary" onClick={() => onEdit(field)} small>
            Modifier
          </Button>
          <Button variant="delete" onClick={() => handleDeleteClick(field)} small>
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
          onClick={() => onEdit({ id: 0, name: "", description: "" })}>
          + Ajouter une filière
        </Button>
      </div>

      <Table
        data={fields}
        columns={columns}
        emptyMessage="Aucune filière trouvée"
      />

      {selectedField && (
        <FieldDetailsModal
          field={selectedField}
          modules={modules.filter(m => m.fieldId === selectedField.id)}
          subModules={subModules.filter(sm => modules.some(m => m.id === sm.moduleId && m.fieldId === selectedField.id))}
          groups={groups.filter(g => g.filiereId === selectedField.id)}
          professors={professors}
          onClose={() => setSelectedField(null)}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityName={selectedField?.name || "cette filière"}
      />
    </div>
  );
};

export default FieldsTab;
