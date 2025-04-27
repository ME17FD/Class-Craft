import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import styles from "../../styles/PedagogicalDashboard-components/ModuleFormModal.module.css";
import { Module, Field, SubModule } from "../../types/type";

interface ModuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (moduleData: Omit<Module, 'id'> & { subModules: Omit<SubModule, 'id' | 'moduleId'>[] }) => void;
  fields: Field[];
  module?: Module & { subModules: SubModule[] };
}

export const ModuleFormModal: React.FC<ModuleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fields,
  module
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [fieldId, setFieldId] = useState<number>(0);
  const [subModules, setSubModules] = useState<{ name: string; hours: number }[]>([]);
  const [newSubModuleName, setNewSubModuleName] = useState("");
  const [newSubModuleHours, setNewSubModuleHours] = useState<number>(0);

  useEffect(() => {
    if (module) {
      setName(module.name);
      setCode(module.code);
      setFieldId(module.fieldId);
      setSubModules(module.subModules.map(sm => ({
        name: sm.name,
        hours: sm.hours
      })));
    } else {
      setName("");
      setCode("");
      setFieldId(0);
      setSubModules([]);
    }
  }, [module]);

  const handleSubmit = () => {
    if (!name || !code || !fieldId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onSubmit({
      name,
      code,
      fieldId,
      subModules
    });
  };

  const addSubModule = () => {
    if (!newSubModuleName || newSubModuleHours <= 0) {
      alert('Veuillez remplir tous les champs du sous-module');
      return;
    }

    setSubModules([...subModules, {
      name: newSubModuleName,
      hours: newSubModuleHours
    }]);
    setNewSubModuleName('');
    setNewSubModuleHours(0);
  };

  const removeSubModule = (index: number) => {
    setSubModules(subModules.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{module ? 'Modifier le module' : 'Ajouter un module'}</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nom du module *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="code">Code du module *</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="field">Filière *</label>
            <select
              id="field"
              value={fieldId}
              onChange={(e) => setFieldId(Number(e.target.value))}
              required
            >
              <option value="">Sélectionnez une filière</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.section}>
            <h3>Sous-modules</h3>
            <div className={styles.subModulesList}>
              <ul>
                {subModules.map((subModule, index) => (
                  <li key={index}>
                    <span>{subModule.name} ({subModule.hours}h)</span>
                    <Button
                      variant="secondary"
                      onClick={() => removeSubModule(index)}
                    >
                      Supprimer
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.subModuleForm}>
              <h4>Ajouter un sous-module</h4>
              <div className={styles.formGroup}>
                <label htmlFor="subModuleName">Nom du sous-module</label>
                <input
                  id="subModuleName"
                  type="text"
                  value={newSubModuleName}
                  onChange={(e) => setNewSubModuleName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="subModuleHours">Nombre d'heures</label>
                <input
                  id="subModuleHours"
                  type="number"
                  min="1"
                  value={newSubModuleHours}
                  onChange={(e) => setNewSubModuleHours(Number(e.target.value))}
                />
              </div>
              <Button variant="secondary" onClick={addSubModule}>
                Ajouter le sous-module
              </Button>
            </div>
          </div>

          <div className={styles.buttons}>
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {module ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleFormModal; 