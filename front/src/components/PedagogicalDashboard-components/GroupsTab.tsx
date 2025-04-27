import React, { useState, useEffect } from "react";
import styles from "../../styles/PedagogicalDashboard-components/GroupsTab.module.css";
import Button from "./Button";
import { Group, Field, Module, SubModule, Professor, Student } from "../../types/type";
import Table from "./TableActions";
import UnassignedStudentsModal from "./UnassignedStudentsModal";

interface GroupsTabProps {
  groups: Group[];
  fields: Field[];
  modules: Module[];
  subModules: SubModule[];
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
  subModules = [],
  professors = [],
  students = [],
  onEdit,
  onDelete,
  onAssignStudents,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isUnassignedModalOpen, setIsUnassignedModalOpen] = useState(false);
  
  // États pour les filtres
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedSubModule, setSelectedSubModule] = useState<number | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(null);
  
  // Filtrer les modules en fonction de la filière sélectionnée
  const filteredModules = selectedField 
    ? modules.filter(module => module.fieldId === selectedField)
    : modules;
  
  // Filtrer les sous-modules en fonction du module sélectionné
  const filteredSubModules = selectedModule
    ? subModules.filter(subModule => subModule.moduleId === selectedModule)
    : subModules;
  
  // Filtrer les groupes en fonction des filtres sélectionnés
  const filteredGroups = groups.filter(group => {
    // Filtrer par filière
    if (selectedField && group.fieldId !== selectedField) {
      return false;
    }
    
    // Filtrer par module (si le groupe a des étudiants qui suivent ce module)
    if (selectedModule) {
      // Logique à implémenter: vérifier si des étudiants du groupe suivent ce module
      // Pour l'instant, on retourne true pour tous les groupes
      return true;
    }
    
    // Filtrer par sous-module (si le groupe a des étudiants qui suivent ce sous-module)
    if (selectedSubModule) {
      // Logique à implémenter: vérifier si des étudiants du groupe suivent ce sous-module
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

  const handleAssignStudents = (group: Group) => {
    setSelectedGroup(group);
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

  const columns = [
    {
      header: "Nom",
      accessor: "name" as keyof Group,
    },
    {
      header: "Filière",
      render: (group: Group) => {
        const field = fields.find((f) => f.id === group.fieldId);
        return field ? field.name : "N/A";
      },
    },
    {
      header: "Étudiants",
      render: (group: Group) => {
        return (
          <div className={styles.moduleList}>
            {group.students.map(student => (
              <span key={student.id} className={styles.moduleTag}>
                {student.firstName} {student.lastName}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: "Modules",
      render: (group: Group) => {
        const groupModules = modules.filter(module => module.fieldId === group.fieldId);
        return (
          <div className={styles.moduleList}>
            {groupModules.map(module => (
              <span key={module.id} className={styles.moduleTag}>
                {module.name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: "Professeurs",
      render: (group: Group) => {
        const groupProfessors = professors.filter(professor => 
          professor.modules?.some(moduleId => 
            modules.some(module => 
              module.id === moduleId && module.fieldId === group.fieldId
            )
          )
        );
        return (
          <div className={styles.professorList}>
            {groupProfessors.map(professor => (
              <span key={professor.id} className={styles.professorTag}>
                {professor.name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: "Actions",
      render: (group: Group) => (
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => onEdit(group)}
          >
            Modifier
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleAssignStudents(group)}
          >
            Assigner des étudiants
          </Button>
          <Button
            variant="delete"
            onClick={() => onDelete(group)}
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  const resetFilters = () => {
    setSelectedField(null);
    setSelectedModule(null);
    setSelectedSubModule(null);
    setSelectedProfessor(null);
  };

  return (
    <div className={styles.groupsTab}>
      <div className={styles.header}>
        <Button variant="primary" onClick={() => onEdit({ id: 0, name: "", fieldId: 0, students: [] })}>
          + Ajouter un groupe
        </Button>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Filière:</label>
          <select 
            value={selectedField || ""} 
            onChange={(e) => {
              setSelectedField(e.target.value ? Number(e.target.value) : null);
              setSelectedModule(null);
              setSelectedSubModule(null);
            }}
          >
            <option value="">Toutes les filières</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Module:</label>
          <select 
            value={selectedModule || ""} 
            onChange={(e) => {
              setSelectedModule(e.target.value ? Number(e.target.value) : null);
              setSelectedSubModule(null);
            }}
            disabled={!selectedField}
          >
            <option value="">Tous les modules</option>
            {filteredModules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Sous-module:</label>
          <select 
            value={selectedSubModule || ""} 
            onChange={(e) => setSelectedSubModule(e.target.value ? Number(e.target.value) : null)}
            disabled={!selectedModule}
          >
            <option value="">Tous les sous-modules</option>
            {filteredSubModules.map((subModule) => (
              <option key={subModule.id} value={subModule.id}>
                {subModule.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Professeur:</label>
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
        </div>
        
        <Button 
          variant="secondary" 
          onClick={resetFilters}
          small
        >
          Réinitialiser les filtres
        </Button>
      </div>
      
      <Table
        data={filteredGroups}
        columns={columns}
        emptyMessage="Aucun groupe trouvé"
      />

      {isUnassignedModalOpen && selectedGroup && (
        <UnassignedStudentsModal
          onClose={handleCloseUnassignedModal}
          onAssignStudent={handleAssignStudent}
          students={students.filter(student => student.groupId === null)}
        />
      )}
    </div>
  );
};

export default GroupsTab;
