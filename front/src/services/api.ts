import React, { useState, useCallback } from "react";
import styles from "../../styles/PedagogicalDashboard-components/GroupsTab.module.css";
import Button from "./Button";
import { Group, Field, Module, Professor, Student } from "../../types/type";
import Table from "./TableActions";
import GroupStudentsModal from "./GroupStudentsModal";
import UnassignedStudentsModal from "./UnassignedStudentsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import api from "../../services/api";
import { useApiData } from "../../hooks/useApiData";
import { isAxiosError } from "axios";

const GroupsTab: React.FC = () => {
  const {
    groups = [],
    fields = [],
    modules = [],
    professors = [],
    students = [],
    addGroup,
    updateGroup,
    deleteGroup,
    updateStudent,
  } = useApiData();

  // États UI
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [isUnassignedModalOpen, setIsUnassignedModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // États filtres
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(null);

  // Filtrer les données
  const filteredModules = selectedField
    ? modules.filter((module) => module.fieldId === selectedField)
    : modules;

  const filteredGroups = groups.filter((group) => {
    if (selectedField && group.filiereId !== selectedField) return false;
    if (selectedModule) return true;
    if (selectedProfessor) return true;
    return true;
  });

  // Gestion des étudiants
  const handleShowStudents = (group: Group) => {
    setSelectedGroup(group);
    setIsStudentsModalOpen(true);
  };

  const handleAssignStudents = useCallback(
    async (studentId: number) => {
      if (!selectedGroup) return;

      try {
        setIsLoading(true);
        await updateStudent({
          ...students.find((s) => s.id === studentId)!,
          groupId: selectedGroup.id,
        });
        setIsUnassignedModalOpen(false);
        setIsStudentsModalOpen(false);
        setError(null);
      } catch (error) {
        console.error("Assignation failed:", error);
        setError(
          isAxiosError(error)
            ? error.response?.data?.message || "Échec de l'assignation"
            : "Erreur inconnue"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [selectedGroup, students, updateStudent]
  );

  // Gestion suppression
  const handleDeleteClick = (group: Group) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedGroup) return;

    try {
      setIsLoading(true);
      setError(null);

      // Appel à l'API via useApiData
      await deleteGroup(selectedGroup.id);

      setIsDeleteModalOpen(false);
      setSelectedGroup(null);
    } catch (error) {
      console.error("Delete error:", error);
      setError(
        isAxiosError(error)
          ? error.response?.data?.message || "Échec de la suppression"
          : "Erreur inconnue"
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedGroup, deleteGroup]);

  // Gestion édition/création
  const handleEditGroup = useCallback(
    async (group: Group) => {
      try {
        setIsLoading(true);
        setError(null);

        if (group.id === 0) {
          await addGroup(group);
        } else {
          await updateGroup(group);
        }
      } catch (error) {
        console.error("Save error:", error);
        setError(
          isAxiosError(error)
            ? error.response?.data?.message || "Échec de la sauvegarde"
            : "Erreur inconnue"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [addGroup, updateGroup]
  );

  // Configuration colonnes tableau
  const columns = [
    { header: "Nom", accessor: "name" as keyof Group },
    {
      header: "Filière",
      render: (group: Group) =>
        fields.find((f) => f.id === group.filiereId)?.name || "Inconnue",
    },
    {
      header: "Nombre d'étudiants",
      render: (group: Group) => (
        <span
          className= { styles.studentCount }
          onClick={() => handleShowStudents(group)}
        >
  { group.students.length }
  </span>
      ),
    },
{
  header: "Actions",
    render: (group: Group) => (
      <div className= { styles.actions } >
      <Button
            variant="secondary"
  onClick = {() => handleEditGroup(group)
}
disabled = { isLoading }
  >
  Modifier
  </Button>
  < Button
variant = "delete"
onClick = {() => handleDeleteClick(group)}
disabled = { isLoading }
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
  setSelectedProfessor(null);
};

return (
  <div className= { styles.container } >
  { error && (
    <div className={ styles.error }>
      { error }
      < button onClick = {() => setError(null)}>×</button>
        </div>
      )}

<div className={ styles.header }>
  <div className={ styles.filters }>
    <select
            value={ selectedField || "" }
onChange = {(e) =>
setSelectedField(e.target.value ? Number(e.target.value) : null)
            }
          >
  <option value="" > Toutes les filières </option>
{
  fields.map((field) => (
    <option key= { field.id } value = { field.id } >
    { field.name }
    </option>
  ))
}
</select>

  < select
value = { selectedModule || ""}
onChange = {(e) =>
setSelectedModule(e.target.value ? Number(e.target.value) : null)
            }
          >
  <option value="" > Tous les modules </option>
{
  filteredModules.map((module) => (
    <option key= { module.id } value = { module.id } >
    { module.name }
    </option>
  ))
}
</select>

  < select
value = { selectedProfessor || ""}
onChange = {(e) =>
setSelectedProfessor(e.target.value ? Number(e.target.value) : null)
            }
          >
  <option value="" > Tous les professeurs </option>
{
  professors.map((professor) => (
    <option key= { professor.id } value = { professor.id } >
    { professor.name }
    </option>
  ))
}
</select>

  < Button variant = "secondary" onClick = { resetFilters } >
    Réinitialiser
    </Button>
    </div>

    < Button
variant = "secondary"
onClick = {() =>
handleEditGroup({ id: 0, name: "", filiereId: 0, students: [] })
          }
disabled = { isLoading }
  >
  + AJOUTER UN GROUPE
    </Button>
    </div>

    < Table
data = { filteredGroups }
columns = { columns }
emptyMessage = "Aucun groupe trouvé"
  />

  { isStudentsModalOpen && selectedGroup && (
    <GroupStudentsModal
          isOpen={ isStudentsModalOpen }
students = { selectedGroup.students }
onClose = {() => setIsStudentsModalOpen(false)}
onAssignStudents = {() => setIsUnassignedModalOpen(true)}
        />
      )}

<UnassignedStudentsModal
        isOpen={ isUnassignedModalOpen }
onClose = {() => setIsUnassignedModalOpen(false)}
onAssignStudent = { handleAssignStudents }
students = { students.filter((s) => !s.groupId) }
  />

  <DeleteConfirmationModal
        isOpen={ isDeleteModalOpen }
onClose = {() => setIsDeleteModalOpen(false)}
onConfirm = { handleConfirmDelete }
entityName = { selectedGroup?.name || "ce groupe"}
isProcessing = { isLoading }
  />
  </div>
  );
};

export default GroupsTab;