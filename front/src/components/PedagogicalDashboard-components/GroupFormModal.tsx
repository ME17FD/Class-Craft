import React, { useEffect } from "react";
import styles from "../../styles/PedagogicalDashboard-components/GroupFormModal.module.css";
import { Group, Field } from "../../types/type";
import Button from "./Button";

interface GroupFormModalProps {
  isOpen: boolean;
  group?: Group;
  fields: Field[];
  onSave: (groupData: Omit<Group, "id" | "students">) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const GroupFormModal: React.FC<GroupFormModalProps> = ({
  isOpen,
  group,
  fields,
  onSave,
  onClose,
  isLoading = false,
}) => {
  const [name, setName] = React.useState("");
  const [filiereId, setFiliereId] = React.useState<number>(0);

  // Reset form when opening or when group changes
  useEffect(() => {
    if (isOpen) {
      setName(group?.name || "");
      setFiliereId(group?.filiereId || fields[0]?.id || 0);
    }
  }, [isOpen, group, fields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && filiereId) {
      await onSave({ name, filiereId });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        
        <h2>{group ? "Modifier le groupe" : "Ajouter un groupe"}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nom du groupe</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Filière</label>
            <select
              value={filiereId}
              onChange={(e) => setFiliereId(Number(e.target.value))}
              required
              disabled={isLoading}
            >
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.modalActions}>
            <Button 
              variant="secondary" 
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupFormModal;