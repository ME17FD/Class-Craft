import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import styles from "../../styles/PedagogicalDashboard-components/FieldFormModal.module.css";
import { Field, Module, SubModule } from "../../types/type";

interface ExtendedModule extends Module {
  subModules: SubModule[];
}

interface FieldFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (field: Omit<Field, "id"> & { modules: ExtendedModule[] }) => void;
  field?: Field & { modules: ExtendedModule[] };
}

interface ModuleFormData {
  name: string;
  code: string;
  subModules: { name: string; hours: number }[];
}

const FieldFormModal: React.FC<FieldFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  field,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modules, setModules] = useState<ModuleFormData[]>([]);
  const [currentModule, setCurrentModule] = useState<ModuleFormData>({
    name: "",
    code: "",
    subModules: [],
  });
  const [currentSubModule, setCurrentSubModule] = useState<{
    name: string;
    hours: number;
  }>({
    name: "",
    hours: 0,
  });

  useEffect(() => {
    if (field) {
      setName(field.name);
      setDescription(field.description);
      setModules(field.modules.map(m => ({
        name: m.name,
        code: m.code,
        subModules: m.subModules.map(sm => ({
          name: sm.name,
          hours: sm.hours
        }))
      })));
    } else {
      setName("");
      setDescription("");
      setModules([]);
    }
  }, [field]);

  const handleAddSubModule = () => {
    if (currentSubModule.name && currentSubModule.hours > 0) {
      setCurrentModule({
        ...currentModule,
        subModules: [...currentModule.subModules, { ...currentSubModule }],
      });
      setCurrentSubModule({ name: "", hours: 0 });
    }
  };

  const handleRemoveSubModule = (index: number) => {
    const updatedSubModules = [...currentModule.subModules];
    updatedSubModules.splice(index, 1);
    setCurrentModule({
      ...currentModule,
      subModules: updatedSubModules,
    });
  };

  const handleAddModule = () => {
    if (currentModule.name && currentModule.code && currentModule.subModules.length > 0) {
      setModules([...modules, { ...currentModule }]);
      setCurrentModule({
        name: "",
        code: "",
        subModules: [],
      });
    }
  };

  const handleRemoveModule = (index: number) => {
    const updatedModules = [...modules];
    updatedModules.splice(index, 1);
    setModules(updatedModules);
  };

  const handleSubmit = () => {
    onSubmit({
      name,
      description,
      modules: modules.map((m, index) => ({
        id: field?.modules[index]?.id || 0,
        name: m.name,
        code: m.code,
        filiereId: field?.id || 0,
        subModules: m.subModules.map((sm, smIndex) => ({
          id: field?.modules[index]?.subModules[smIndex]?.id || 0,
          name: sm.name,
          hours: sm.hours,
          moduleId: field?.modules[index]?.id || 0,
        })),
      })),
    });
    onClose();
  };

  const isValid = name && description && modules.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={field ? "Modifier une filière" : "Ajouter une filière"}
    >
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nom de la filière</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.section}>
          <h3>Modules et Sous-modules</h3>
          
          {modules.length > 0 && (
            <div className={styles.modulesList}>
              <h4>Modules ajoutés</h4>
              <ul>
                {modules.map((module, index) => (
                  <li key={index}>
                    {module.name} ({module.code})
                    <Button
                      variant="delete"
                      onClick={() => handleRemoveModule(index)}
                      small
                    >
                      Supprimer
                    </Button>
                    <ul>
                      {module.subModules.map((sm, smIndex) => (
                        <li key={smIndex}>
                          {sm.name} - {sm.hours}h
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.moduleForm}>
            <h4>Ajouter un module</h4>
            <div className={styles.formGroup}>
              <label>Nom du module</label>
              <input
                type="text"
                value={currentModule.name}
                onChange={(e) =>
                  setCurrentModule({ ...currentModule, name: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Code du module</label>
              <input
                type="text"
                value={currentModule.code}
                onChange={(e) =>
                  setCurrentModule({ ...currentModule, code: e.target.value })
                }
              />
            </div>

            <div className={styles.subModulesSection}>
              <h5>Sous-modules</h5>
              
              {currentModule.subModules.length > 0 && (
                <ul className={styles.subModulesList}>
                  {currentModule.subModules.map((sm, index) => (
                    <li key={index}>
                      {sm.name} - {sm.hours}h
                      <Button
                        variant="delete"
                        onClick={() => handleRemoveSubModule(index)}
                        small
                      >
                        Supprimer
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.subModuleForm}>
                <div className={styles.formGroup}>
                  <label>Nom du sous-module</label>
                  <input
                    type="text"
                    value={currentSubModule.name}
                    onChange={(e) =>
                      setCurrentSubModule({
                        ...currentSubModule,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Nombre d'heures</label>
                  <input
                    type="number"
                    min="1"
                    value={currentSubModule.hours}
                    onChange={(e) =>
                      setCurrentSubModule({
                        ...currentSubModule,
                        hours: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={handleAddSubModule}
                >
                  Ajouter le sous-module
                </Button>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleAddModule}
              disabled={
                !currentModule.name ||
                !currentModule.code ||
                currentModule.subModules.length === 0
              }
            >
              Ajouter le module
            </Button>
          </div>
        </div>

        <div className={styles.buttons}>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={!isValid}
          >
            {field ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FieldFormModal; 