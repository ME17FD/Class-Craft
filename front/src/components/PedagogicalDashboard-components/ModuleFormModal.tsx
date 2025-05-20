import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import styles from "../../styles/PedagogicalDashboard-components/ModuleFormModal.module.css";
import { Module, Field, SubModule } from "../../types/type";

interface ModuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (moduleData: {
    name: string;
    code: string;
    filiereId: number;
    subModules: Omit<SubModule, 'id' | 'moduleId'>[];
  }) => void;
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
  const [filiereId, setFiliereId] = useState<number | null>(null);
  const [subModules, setSubModules] = useState<Omit<SubModule, 'id' | 'moduleId'>[]>([]);
  const [newSubModuleName, setNewSubModuleName] = useState("");
  const [newSubModuleHours, setNewSubModuleHours] = useState<number>(1);

  useEffect(() => {
    if (module) {
      setName(module.name);
      setCode(module.code);
      setFiliereId(module.filiereId);
      setSubModules(module.subModules.map(sm => ({
        name: sm.name,
        nbrHours: sm.nbrHours
      })));
    } else {
      resetForm();
    }
  }, [module]);

  const resetForm = () => {
    setName("");
    setCode("");
    setFiliereId(null);
    setSubModules([]);
    setNewSubModuleName("");
    setNewSubModuleHours(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !code || !filiereId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const moduleData: {
      name: string;
      code: string;
      filiereId: number;
      subModules: Omit<SubModule, 'id' | 'moduleId'>[];
    } = {
      name,
      code,
      filiereId,
      subModules
    };

    onSubmit(moduleData);
    resetForm();
  };

  const addSubModule = () => {
  if (!newSubModuleName.trim() || newSubModuleHours <= 0) {
    alert('Veuillez remplir tous les champs du sous-module avec des valeurs valides');
    return;
  }

  setSubModules([...subModules, {
    name: newSubModuleName.trim(),
    nbrHours: newSubModuleHours
  }]);
  setNewSubModuleName('');
  setNewSubModuleHours(1);
};

  const removeSubModule = (index: number) => {
    setSubModules(subModules.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <Modal title="title" isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalContent}>
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
              value={filiereId || ""}
              onChange={(e) => setFiliereId(e.target.value ? Number(e.target.value) : null)}
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
            {subModules.length > 0 ? (
              <div className={styles.subModulesList}>
                <ul>
                  {subModules.map((subModule, index) => (
                    <li key={index}>
                      <span>{subModule.name} ({subModule.nbrHours}h)</span>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeSubModule(index)}
                      >
                        Supprimer
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Aucun sous-module ajouté</p>
            )}

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
                  onChange={(e) => setNewSubModuleHours(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <Button type="button" variant="secondary" onClick={addSubModule}>
                Ajouter le sous-module
              </Button>
            </div>
          </div>

          <div className={styles.buttons}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              {module ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModuleFormModal;