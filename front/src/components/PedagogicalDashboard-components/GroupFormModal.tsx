import React from "react";
import styles from "../../styles/PedagogicalDashboard-components/GroupFormModal.module.css";
import { Group, Field } from "../../types/type";
import Button from "./Button";

interface GroupFormModalProps {
  group?: Group;
  fields: Field[];
  onSave: (groupData: Omit<Group, "id" | "students">) => void;
  onClose: () => void;
}

const GroupFormModal: React.FC<GroupFormModalProps> = ({
  group,
  fields,
  onSave,
  onClose,
}) => {
  const [name, setName] = React.useState(group?.name || "");
  const [filiereId, setFiliereId] = React.useState(group?.filiereId || fields[0]?.id || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      filiereId,
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{group ? "Modifier le groupe" : "Ajouter un groupe"}</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nom du groupe</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Filière</label>
            <select
              value={filiereId}
              onChange={(e) => setFiliereId(Number(e.target.value))}
              required
            >
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupFormModal;
