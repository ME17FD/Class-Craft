import React, { useState, useCallback, useEffect } from "react";
import styles from "../../styles/PedagogicalDashboard-components/GroupsTab.module.css";
import Button from "./Button";
import { Group, Field, Module, Professor, Student } from "../../types/type";
import Table from "./TableActions";
import GroupStudentsModal from "./GroupStudentsModal";
import UnassignedStudentsModal from "./UnassignedStudentsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import GroupFormModal from "./GroupFormModal";
import { useApiData } from "../../hooks/useApiData";

interface GroupsTabProps {
  groups: Group[];
  fields: Field[];
  modules: Module[];
  professors: Professor[];
  students: Student[];
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
  onAssignStudents: (groupId: number, assign: boolean) => void;
}

const GroupsTab: React.FC<GroupsTabProps> = ({
  groups: initialGroups = [],
  fields = [],
  modules = [],
  professors = [],
  students = [],
  onEdit,
  onDelete,
  onAssignStudents,
}) => {
  const [localGroups, setLocalGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [isUnassignedModalOpen, setIsUnassignedModalOpen] = useState(false);
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | undefined>(undefined);

  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(null);

  const apiData = useApiData();

  useEffect(() => {
    setLocalGroups(initialGroups);
  }, [initialGroups]);

  const filteredModules = selectedField
    ? modules.filter(module => module.fieldId === selectedField)
    : modules;

  const filteredGroups = localGroups.filter(group => {
    if (selectedField && group.filiereId !== selectedField) return false;
    if (selectedModule) return true;
    if (selectedProfessor) return true;
    return true;
  });

  const handleShowStudents = (group: Group) => {
    setSelectedGroup(group);
    setIsStudentsModalOpen(true);
  };

  const handleAssignStudents = () => {
    setIsStudentsModalOpen(false);
    setIsUnassignedModalOpen(true);
  };

  const handleCloseUnassignedModal = () => {
    setIsUnassignedModalOpen(false);
    setSelectedGroup(null);
  };

  const handleAssignStudent = (studentId: number) => {
    if (selectedGroup) {
      onAssignStudents(studentId, true);
      handleCloseUnassignedModal();
    }
  };

  const handleDeleteClick = (group: Group) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedGroup) {
      onDelete(selectedGroup);
      setLocalGroups(prev => prev.filter(group => group.id !== selectedGroup.id));
      setIsDeleteModalOpen(false);
      setSelectedGroup(null);
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setIsGroupFormOpen(true);
  };

  const handleSaveGroup = async (groupData: Omit<Group, "id" | "students">) => {
    if (editingGroup) {
      const updatedGroup = { ...editingGroup, ...groupData };
      onEdit(updatedGroup);
      setLocalGroups(prev =>
        prev.map(group => group.id === updatedGroup.id ? updatedGroup : group)
      );
    } else {
      const newGroup = await apiData.addGroup(groupData);
      if (newGroup) {
        setLocalGroups(prev => [...prev, { ...newGroup, students: [] }]);
      }
    }
    setIsGroupFormOpen(false);
  };
  
  const columns = [
    { header: "Nom", accessor: "name" as keyof Group },
    {
      header: "Filière",
      render: (group: Group) => fields.find(f => f.id === group.filiereId)?.name || "Inconnue"
    },
    {
      header: "Nombre d'étudiants",
      render: (group: Group) => (
        <span className={styles.studentCount} onClick={() => handleShowStudents(group)}>
          {group.students?.length}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (group: Group) => (
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => handleEdit(group)}>Modifier</Button>
          <Button variant="delete" onClick={() => handleDeleteClick(group)}>Supprimer</Button>
        </div>
      ),
    },
  ];

  const resetFilters = () => {
    setSelectedField(null);
    setSelectedModule(null);
    setSelectedProfessor(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filters}>
          <select
            value={selectedField || ""}
            onChange={(e) => setSelectedField(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Toutes les filières</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>{field.name}</option>
            ))}
          </select>

          <select
            value={selectedModule || ""}
            onChange={(e) => setSelectedModule(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Tous les modules</option>
            {filteredModules.map((module) => (
              <option key={module.id} value={module.id}>{module.name}</option>
            ))}
          </select>

          <select
            value={selectedProfessor || ""}
            onChange={(e) => setSelectedProfessor(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Tous les professeurs</option>
            {professors.map((professor) => (
              <option key={professor.id} value={professor.id}>{professor.name}</option>
            ))}
          </select>

          <Button variant="secondary" onClick={resetFilters}>Réinitialiser les filtres</Button>
        </div>

        <Button
          variant="secondary"
          onClick={() => {
            setEditingGroup(undefined);
            setIsGroupFormOpen(true);
          }}
        >
          + AJOUTER UN GROUPE
        </Button>
      </div>

      <Table data={filteredGroups} columns={columns} emptyMessage="Aucun groupe trouvé" />

      {isStudentsModalOpen && selectedGroup && (
        <GroupStudentsModal
          isOpen={isStudentsModalOpen}
          students={selectedGroup.students ?? []}
          onClose={() => setIsStudentsModalOpen(false)}
          onAssignStudents={handleAssignStudents}
        />
      )}

      <UnassignedStudentsModal
        isOpen={isUnassignedModalOpen}
        onClose={() => setIsUnassignedModalOpen(false)}
        onAssignStudent={handleAssignStudent}
        students={students.filter(s => !s.groupId)}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityName={selectedGroup?.name || "ce groupe"}
      />

      {isGroupFormOpen && (
        <GroupFormModal
          group={editingGroup}
          fields={fields}
          onSave={handleSaveGroup}
          onClose={() => setIsGroupFormOpen(false)}
        />
      )}
    </div>
  );
};

export default GroupsTab;
