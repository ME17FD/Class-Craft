import React, { useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/CrudModal.module.css";
import Button from "./Button";
import {
  CrudModalType,
  TabType,
  Student,
  Group,
  Field,
  Module,
  SubModule,
  Professor,
} from "../../types/type";

interface CrudModalProps {
  isOpen: boolean;
  type: CrudModalType;
  entityType: TabType;
  entity: any;
  fields: Field[];
  modules: Module[];
  subModules: SubModule[];
  onSave: (data: any) => void;
  onClose: () => void;
  onAssignStudent?: (studentId: number, assign: boolean) => void;
}

const CrudModal: React.FC<CrudModalProps> = ({
  isOpen,
  type,
  entityType,
  entity,
  fields,
  modules,
  subModules,
  onSave,
  onClose,
  onAssignStudent,
}) => {
  const [formData, setFormData] = useState(entity);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    const options = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setFormData({ ...formData, [field]: options });
  };

  const renderFormFields = () => {
    switch (entityType) {
      case "groups":
        return (
          <>
            <div className={styles.formGroup}>
              <label>Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Filière</label>
              <select
                name="fieldId"
                value={formData.fieldId || ""}
                onChange={handleChange}>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      // Cas pour les autres entités...
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>
          {type === "add" && `Ajouter ${entityType}`}
          {type === "edit" && `Modifier ${entity.name}`}
          {type === "delete" && `Supprimer ${entity.name}`}
        </h2>

        {type !== "delete" ? (
          <form>
            {renderFormFields()}
            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={onClose}>
                Annuler
              </Button>
              <Button variant="primary" onClick={() => onSave(formData)}>
                Sauvegarder
              </Button>
            </div>
          </form>
        ) : (
          <div className={styles.deleteConfirmation}>
            <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={onClose}>
                Annuler
              </Button>
              <Button variant="delete" onClick={() => onSave(entity)}>
                Confirmer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrudModal;
