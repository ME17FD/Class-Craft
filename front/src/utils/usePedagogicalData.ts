import { useState } from 'react';
import { 
  PedagogicalData, 
  ModalState, 
  CrudModalType,
  TabType
} from '../types/type';

const usePedagogicalData = () => {
  // Données initiales
  const initialData: PedagogicalData = {
    groups: [
      { 
        id: 1, 
        name: 'Groupe A', 
        fieldId: 1,
        students: [
          { id: 1, name: 'Alice Dupont', cne: 'A12345', groupId: 1 },
          { id: 2, name: 'Bob Martin', cne: 'A12346', groupId: 1 }
        ] 
      }
    ],
    allStudents: [
      { id: 3, name: 'Charlie Brown', cne: 'B12345', groupId: null }
    ],
    fields: [
      { id: 1, name: 'Informatique', description: 'Filière en informatique' }
    ],
    modules: [
      { id: 1, name: 'Algorithmique', code: 'ALG-101', fieldId: 1 }
    ],
    subModules: [
      { id: 1, name: 'Algorithmes avancés', hours: 30, moduleId: 1 }
    ],
    professors: [
      { id: 1, name: 'Dr. Smith', email: 'smith@univ.edu', modules: [1], subModules: [1] }
    ]
  };

  const [data, setData] = useState<PedagogicalData>(initialData);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: 'add',
    entityType: 'groups',
    entity: null
  });

  const handleAdd = (entityType: TabType) => {
    setModalState({
      isOpen: true,
      type: 'add',
      entityType,
      entity: null
    });
  };

  const handleEdit = (entity: any, entityType?: TabType) => {
    setModalState({
      isOpen: true,
      type: 'edit',
      entityType: entityType || modalState.entityType,
      entity
    });
  };

  const handleDelete = (entity: any, entityType?: TabType) => {
    setModalState({
      isOpen: true,
      type: 'delete',
      entityType: entityType || modalState.entityType,
      entity
    });
  };

  const handleAssignStudents = (group: Group) => {
    setModalState({
      isOpen: true,
      type: 'assign',
      entityType: 'groups',
      entity: group
    });
  };

  const handleSave = (entityData: any) => {
    const { entityType } = modalState;
    
    if (modalState.type === 'add') {
      // Logique d'ajout
    } else if (modalState.type === 'edit') {
      // Logique de modification
    } else if (modalState.type === 'delete') {
      // Logique de suppression
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    data,
    modalState,
    handleAdd,
    handleEdit,
    handleDelete,
    handleAssignStudents,
    handleSave,
    handleCloseModal
  };
};

export default usePedagogicalData;