import React, { useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/CrudModal.module.css";
import Button from "./Button";
import Modal from "./Modal";
import {
  CrudModalType,
  TabType,
  Group,
  Field,
  Module,
  SubModule,
} from "../../types/type";

interface CrudModalProps {
  isOpen: boolean;
  type: CrudModalType;
  entityType: TabType;
  entity: any;
  fields: Field[];
  modules: Module[];
  subModules: SubModule[];
  groups: Group[];
  onSave: (entityType: TabType, data: any) => void;
  onClose: () => void;
  onAssignStudent?: (
    studentId: number,
    studentIds: number[],
    assign: boolean
  ) => Promise<boolean>;
}

const CrudModal: React.FC<CrudModalProps> = ({
  isOpen,
  type,
  entityType,
  entity,
  fields,
  modules,
  subModules,
  groups,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState(() => ({
    ...entity,
    subModules: entity?.subModules || [],
  }));

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

  const handleSubmit = () => {
    onSave(entityType, formData);
  };

  const handleAddSubModule = () => {
    const newSubModules = [
      ...(formData.subModules || []),
      { name: "", hours: 0 },
    ];
    setFormData({ ...formData, subModules: newSubModules });
  };

  const handleSubModuleChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newSubModules = [...(formData.subModules || [])];
    newSubModules[index] = { ...newSubModules[index], [field]: value };
    setFormData({ ...formData, subModules: newSubModules });
  };

  const handleRemoveSubModule = (index: number) => {
    const newSubModules = (formData.subModules || []).filter(
      (_: any, i: number) => i !== index
    );
    setFormData({ ...formData, subModules: newSubModules });
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
                value={formData?.name || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Filière</label>
              <select
                name="filiereId"
                value={formData?.filiereId || ""}
                onChange={handleChange}
                required>
                <option value="">Sélectionnez une filière</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case "modules":
        return (
          <>
            <div className={styles.formGroup}>
              <label>Nom</label>
              <input
                type="text"
                name="name"
                value={formData?.name || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Code</label>
              <input
                type="text"
                name="code"
                value={formData?.code || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Filière</label>
              <select
                name="filiereId"
                value={formData?.filiereId || ""}
                onChange={handleChange}>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Sous-modules</label>
              <div className={styles.subModulesList}>
                {formData.subModules.map((subModule: any, index: number) => (
                  <div key={index} className={styles.subModuleItem}>
                    <div className={styles.subModuleField}>
                      <label>Nom</label>
                      <input
                        type="text"
                        value={subModule.name}
                        onChange={(e) =>
                          handleSubModuleChange(index, "name", e.target.value)
                        }
                        placeholder="Nom du sous-module"
                      />
                    </div>
                    <div className={styles.subModuleField}>
                      <label>Heures</label>
                      <input
                        type="number"
                        value={subModule.hours}
                        onChange={(e) =>
                          handleSubModuleChange(
                            index,
                            "hours",
                            Number(e.target.value)
                          )
                        }
                        placeholder="Nombre d'heures"
                      />
                    </div>
                    <Button
                      variant="delete"
                      onClick={() => handleRemoveSubModule(index)}>
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="primary" onClick={handleAddSubModule}>
                + Ajouter un sous-module
              </Button>
            </div>
          </>
        );
      case "submodules":
        return (
          <>
            <div className={styles.formGroup}>
              <label>Nom</label>
              <input
                type="text"
                name="name"
                value={formData?.name || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Heures</label>
              <input
                type="number"
                name="hours"
                value={formData?.hours || 0}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Module parent</label>
              <select
                name="moduleId"
                value={formData?.moduleId || ""}
                onChange={handleChange}>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case "professors":
        return (
          <>
            <div className={styles.formGroup}>
              <label>Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData?.firstName || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData?.lastName || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData?.email || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Modules</label>
              <select
                name="modules"
                value={formData?.modules || []}
                onChange={(e) => handleMultiSelect(e, "modules")}>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Sous-modules</label>
              <select
                name="subModules"
                value={formData?.subModules || []}
                onChange={(e) => handleMultiSelect(e, "subModules")}>
                {subModules.map((subModule) => (
                  <option key={subModule.id} value={subModule.id}>
                    {subModule.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case "students":
        return (
          <>
            <div className={styles.formGroup}>
              <label>CNE</label>
              <input
                type="text"
                name="cne"
                value={formData?.cne || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Apogée</label>
              <input
                type="text"
                name="apogee"
                value={formData?.apogee || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData?.lastName || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="text"
                name="email"
                value={formData?.email || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData?.firstName || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Groupe</label>
              <select
                name="groupId"
                value={formData?.groupId || ""}
                onChange={handleChange}>
                <option value="">Aucun groupe</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Fonction pour obtenir le titre de la modal en fonction du type et de l'entité
  const getModalTitle = () => {
    if (type === "add") {
      return `Ajouter ${entityType}`;
    } else if (type === "edit" && entity) {
      return `Modifier ${entity.name}`;
    } else if (type === "delete" && entity) {
      return `Supprimer ${entity.name}`;
    } else {
      return `${type} ${entityType}`;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()}>
      {type === "delete" ? (
        <div className={styles.deleteConfirmation}>
          <p>
            Êtes-vous sûr de vouloir supprimer {entity?.name || "cet élément"} ?
          </p>
          <p className={styles.warning}>Cette action est irréversible.</p>
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="delete" onClick={handleSubmit}>
              Supprimer
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {renderFormFields()}
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CrudModal;
