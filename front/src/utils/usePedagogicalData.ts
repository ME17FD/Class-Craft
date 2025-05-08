import { useState, useCallback, useEffect } from "react";
import {
  TabType,
  ModalState,
  Student
} from "../types/type";
//import { useMockData } from '../hooks/useMockData';
import { useApiData } from "../hooks/useApiData";
const usePedagogicalData = () => {
  const {
    fields,
    modules,
    subModules,
    groups,
    professors,
    students:initialStudents,
    addField,
    updateField,
    deleteField,
    addModule,
    updateModule,
    deleteModule,
    addSubModule,
    updateSubModule,
    deleteSubModule,
    addGroup,
    updateGroup,
    deleteGroup,
    addProfessor,
    updateProfessor,
    deleteProfessor,
    addStudent,
    updateStudent,
    deleteStudent,
    assignStudentsToGroup,
    removeStudentsFromGroup,
  } = useApiData();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  useEffect(() => {
    if (initialStudents.length > 0) {
      setStudents(initialStudents);
    }
  }, [initialStudents]);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: "add",
    entityType: "groups",
    entity: null,
  });

  const handleAdd = useCallback((entityType: TabType) => {
    setModalState({
      isOpen: true,
      type: "add",
      entityType,
      entity: null,
    });
  }, []);

  const handleEdit = useCallback((entityType: TabType, entity: any) => {
    setModalState({
      isOpen: true,
      type: "edit",
      entityType,
      entity,
    });
  }, []);

  const handleDelete = useCallback((entityType: TabType, entity: any) => {
    setModalState({
      isOpen: true,
      type: "delete",
      entityType,
      entity,
    });
  }, []);

  const handleAssignStudents = useCallback(
    async (groupId: number, studentIds: number[], assign: boolean): Promise<boolean> => {
      try {
        if (assign) {
          await assignStudentsToGroup(groupId, studentIds);
        } else {
          await removeStudentsFromGroup(groupId, studentIds);
        }

        setStudents(prev =>
          prev.map((student: Student) =>
            studentIds.includes(student.id)
              ? { ...student, groupId: assign ? groupId : null }
              : student
          )
        );

        return true;
      } catch (error) {
        console.error("Failed to assign students:", error);
        return false;
      }
    },
    [assignStudentsToGroup, removeStudentsFromGroup]
  );


  const handleSave = useCallback(
    (entityType: TabType, entity: any) => {
      switch (entityType) {
        case "fields":
          if (modalState.type === "add") {
            addField(entity);
          } else if (modalState.type === "edit") {
            updateField(entity);
          } else if (modalState.type === "delete") {
            deleteField(entity.id);
          }
          break;
        case "modules":
          if (modalState.type === "add") {
            addModule(entity);
          } else if (modalState.type === "edit") {
            updateModule(entity);
          } else if (modalState.type === "delete") {
            deleteModule(entity.id);
          }
          break;
        case "submodules":
          if (modalState.type === "add") {
            addSubModule(entity);
          } else if (modalState.type === "edit") {
            updateSubModule(entity);
          } else if (modalState.type === "delete") {
            deleteSubModule(entity.id);
          }
          break;
        case "groups":
          if (modalState.type === "add") {
            addGroup(entity);
          } else if (modalState.type === "edit") {
            updateGroup(entity);
          } else if (modalState.type === "delete") {
            deleteGroup(entity.id);
          }
          break;
        case "professors":
          if (modalState.type === "add") {
            addProfessor(entity);
          } else if (modalState.type === "edit") {
            updateProfessor(entity);
          } else if (modalState.type === "delete") {
            deleteProfessor(entity.id);
          }
          break;
        case "students":
          if (modalState.type === "add") {
            addStudent(entity);
          } else if (modalState.type === "edit") {
            updateStudent(entity);
          } else if (modalState.type === "delete") {
            deleteStudent(entity.id);
          }
          break;
      }
      handleCloseModal();
    },
    [
      modalState.type,
      addField,
      updateField,
      deleteField,
      addModule,
      updateModule,
      deleteModule,
      addSubModule,
      updateSubModule,
      deleteSubModule,
      addGroup,
      updateGroup,
      deleteGroup,
      addProfessor,
      updateProfessor,
      deleteProfessor,
      addStudent,
      updateStudent,
      deleteStudent,
    ]
  );

  const handleCloseModal = useCallback(() => {
    setModalState({
      isOpen: false,
      type: "add",
      entityType: "groups",
      entity: null,
    });
  }, []);

  return {
    data: {
      fields,
      modules,
      subModules,
      groups,
      professors,
      allStudents: students,
    },
    modalState,
    handleAdd,
    handleEdit,
    handleDelete,
    handleAssignStudents,
    handleSave,
    handleCloseModal,
  };
};

export default usePedagogicalData;
