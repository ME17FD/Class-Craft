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
  filiereId: number | null;
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
  lastName: string;
  firstName: string;
  email: string;
  modules: Module[];
  subModules: SubModule[];
  grade ?: string;
  specialty ?: string;
};

export type Group = {
  id ?: number;
  name ?: string;
  filiereId ?: number;
  students ?: Student[];
  modules ?: Module[];
};

export type CrudModalType = 'add' | 'edit' | 'delete' | 'assign';

export type TabType = 'groups' | 'students' | 'fields' | 'modules' | 'submodules' | 'professors' | 'weekly' | 'field' | 'daily' | 'create';

export interface ModalState {
  isOpen: boolean;
  type: CrudModalType;
  entityType: TabType;
  entity: any;
}

export interface PedagogicalData {
  groups: Group[];
  allStudents: Student[];
  fields: Field[];
  modules: Module[];
  subModules: SubModule[];
  professors: Professor[];
}