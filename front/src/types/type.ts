export type Student = {
  id: number;
  cne: string;
  registrationNumber: string;
  lastName: string;
  firstName: string;
  groupId: number | null;
  email?: string;
};

export type Module = {
  id: number;
  name: string;
  code: string;
  fieldId: number | null;
};

export type SubModule = {
  id: number;
  name: string;
  hours: number;
  moduleId: number;
};

export type Field = {
  id: number;
  name: string;
  description: string;
  modules?: ExtendedModule[];
};

export type ExtendedModule = Module & {
  subModules: SubModule[];
};

export type Professor = {
  id: number;
  firstName: string; // Changé ici
  lastName: string;  // Changé ici
  email: string;
  password?: string;
  approved: boolean;
  grade: string;
  specialty: string;
  modules?: number[];
  subModules?: number[];
};
export type Group = {
  id ?: number;
  name ?: string;
  filiereId ?: number;
  students ?: Student[];
};

export type CrudModalType = 'add' | 'edit' | 'delete' | 'assign';

export type TabType = 'groups' | 'students' | 'fields' | 'modules' | 'submodules' | 'professors' | 'weekly' | 'field' | 'daily' | 'create';

export interface ModalState {
  isOpen: boolean;
  type: CrudModalType;
  entityType: TabType;
  entity: unknown;
}

export interface PedagogicalData {
  groups: Group[];
  allStudents: Student[];
  fields: Field[];
  modules: Module[];
  subModules: SubModule[];
  professors: Professor[];
}