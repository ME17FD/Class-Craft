import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import styles from "../../styles/PedagogicalDashboard-components/SubModuleFormModal.module.css";
import { SubModule, Module, Field } from "../../types/type";
import Button from "./Button";

interface SubModuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subModule: Partial<SubModule>) => void;
  subModule?: SubModule;
  modules: Module[];
  fields: Field[];
}

const SubModuleFormModal: React.FC<SubModuleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  subModule,
  modules,
  fields,
}) => {
  const [formData, setFormData] = useState<Partial<SubModule>>({
    name: "",
    hours: 0,
    moduleId: 0,
  });

  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  useEffect(() => {
    if (subModule) {
      setFormData(subModule);
      const module = modules.find(m => m.id === subModule.moduleId);
      setSelectedModule(module || null);
    }
  }, [subModule, modules]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleModuleChange = (moduleId: number) => {
    const module = modules.find(m => m.id === moduleId);
    setSelectedModule(module || null);
    setFormData(prev => ({ ...prev, moduleId }));
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subModule ? "Modifier le sous-module" : "Ajouter un sous-module"}
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nom du sous-module</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="hours">Nombre d'heures</label>
          <input
            type="number"
            id="hours"
            value={formData.hours}
            onChange={(e) => setFormData(prev => ({ ...prev, hours: parseInt(e.target.value) }))}
            required
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="moduleId">Module parent</label>
          <select
            id="moduleId"
            value={formData.moduleId}
            onChange={(e) => handleModuleChange(parseInt(e.target.value))}
            required
          >
            <option value="">Sélectionner un module</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>
        </div>

        {selectedModule && (
          <div className={styles.fieldInfo}>
            Filière: {fields.find(f => f.id === selectedModule.fieldId)?.name}
          </div>
        )}

        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            {subModule ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SubModuleFormModal; 