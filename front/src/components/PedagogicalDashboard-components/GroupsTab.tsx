import React, { useState } from "react";
import styles from "../../styles/PedagogicalDashboard-components/GroupsTab.module.css";
import Button from "./Button";
import { Group, Field, Module, Professor, Student } from "../../types/type";
import Table from "./TableActions";
import GroupStudentsModal from "./GroupStudentsModal";
import UnassignedStudentsModal from "./UnassignedStudentsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

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
  groups = [],
  fields = [],
  modules = [],
  professors = [],
  students = [],
  onEdit,
  onDelete,
  onAssignStudents,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [isUnassignedModalOpen, setIsUnassignedModalOpen] = useState(false);
  
  // États pour les filtres
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(null);
  
  // Filtrer les modules en fonction de la filière sélectionnée
  const filteredModules = selectedField 
    ? modules.filter(module => module.fieldId === selectedField)
    : modules;
  
  // Filtrer les groupes en fonction des filtres sélectionnés
  const filteredGroups = groups.filter(group => {
    // Filtrer par filière
    if (selectedField && group.filiereId !== selectedField) {
      return false;
    }
    
    // Filtrer par module (si le groupe a des étudiants qui suivent ce module)
    if (selectedModule) {
      // Logique à implémenter: vérifier si des étudiants du groupe suivent ce module
      // Pour l'instant, on retourne true pour tous les groupes
      return true;
    }
    
    // Filtrer par professeur (si le professeur enseigne dans ce groupe)
    if (selectedProfessor) {
      // Logique à implémenter: vérifier si le professeur enseigne dans ce groupe
      // Pour l'instant, on retourne true pour tous les groupes
      return true;
    }
    
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
      setIsDeleteModalOpen(false);
      setSelectedGroup(null);
    }
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
        <span 
          className={styles.studentCount}
          onClick={() => handleShowStudents(group)}
        >
          {group.students.length}
        </span>
      )
    },
    {
      header: "Actions",
      render: (group: Group) => (
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onEdit(group)}>
            Modifier
          </Button>
          <Button variant="delete" onClick={() => handleDeleteClick(group)}>
            Supprimer
          </Button>
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
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>

          <select
            value={selectedModule || ""}
            onChange={(e) => setSelectedModule(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Tous les modules</option>
            {filteredModules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>

          <select
            value={selectedProfessor || ""}
            onChange={(e) => setSelectedProfessor(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Tous les professeurs</option>
            {professors.map((professor) => (
              <option key={professor.id} value={professor.id}>
                {professor.name}
              </option>
            ))}
          </select>

          <Button variant="secondary" onClick={resetFilters}>
            Réinitialiser les filtres
          </Button>
        </div>

        <Button
          variant="secondary"
          onClick={() => onEdit({ id: 0, name: "", filiereId: 0, students: [] })}>
          + AJOUTER UN GROUPE
        </Button>
      </div>

      <Table
        data={filteredGroups}
        columns={columns}
        emptyMessage="Aucun groupe trouvé"
      />

      {isStudentsModalOpen && selectedGroup && (
        <GroupStudentsModal
          isOpen={isStudentsModalOpen}
          students={selectedGroup.students}
          onClose={() => setIsStudentsModalOpen(false)}
          onAssignStudents={handleAssignStudents}
        />
      )}

      <UnassignedStudentsModal
        isOpen={isUnassignedModalOpen}
        onClose={() => setIsUnassignedModalOpen(false)}
        onAssignStudent={(studentId) => onAssignStudents(studentId, true)}
        students={students.filter((s) => !s.groupId)}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        entityName={selectedGroup?.name || "ce groupe"}
      />
    </div>
  );
};

export default GroupsTab;
