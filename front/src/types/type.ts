export type Student = {
  id: number;
  cne: string;
  apogee: string;
  lastName: string;
  firstName: string;
  groupId: number | null;
  email?: string;
};

export type Module = {
  id: number;
  name: string;
  code: string;
  fieldId: number;
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
  name: string;
  email: string;
  modules: number[];
  subModules: number[];
};

export type Group = {
  id: number;
  name: string;
  fieldId: number;
  students: Student[];
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