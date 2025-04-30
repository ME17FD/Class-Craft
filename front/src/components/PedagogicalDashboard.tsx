import React, { useState } from "react";
import styles from "../styles/PedagogicalDashboard.module.css";
import TabNav from "./PedagogicalDashboard-components/TabNav";
import GroupsTab from "./PedagogicalDashboard-components/GroupsTab";
import StudentsTab from "./PedagogicalDashboard-components/StudentsTab";
import FieldsTab from "./PedagogicalDashboard-components/FieldsTab";
import ModulesTab from "./PedagogicalDashboard-components/ModulesTab";
import SubModulesTab from "./PedagogicalDashboard-components/SubModulesTab";
import ProfessorsTab from "./PedagogicalDashboard-components/ProfessorsTab";
import CrudModal from "./PedagogicalDashboard-components/CrudModal";
import FieldFormModal from "./PedagogicalDashboard-components/FieldFormModal";
import usePedagogicalData from "../utils/usePedagogicalData";
import { TabType, Field, Module, SubModule, Professor, ExtendedModule } from "../types/type";

const PedagogicalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("groups");
  const [fieldModalState, setFieldModalState] = useState<{
    isOpen: boolean;
    field?: Field & { modules: ExtendedModule[] };
  }>({
    isOpen: false,
  });

  const {
    data,
    modalState,
    handleAdd,
    handleEdit,
    handleDelete,
    handleAssignStudents,
    handleSave,
    handleCloseModal,
  } = usePedagogicalData();

  const handleFieldEdit = (field: Field) => {
    // Find the modules associated with this field
    const fieldModules = data.modules
      .filter(module => module.fieldId === field.id)
      .map(module => ({
        ...module,
        subModules: data.subModules.filter(subModule => subModule.moduleId === module.id)
      }));

    setFieldModalState({
      isOpen: true,
      field: {
        ...field,
        modules: fieldModules
      }
    });
  };

  const handleFieldClose = () => {
    setFieldModalState({
      isOpen: false,
    });
  };

  const handleFieldSave = (fieldData: Omit<Field, "id"> & { modules: ExtendedModule[] }) => {
    handleSave("fields", {
      ...fieldData,
      id: fieldModalState.field?.id || 0,
    });
    handleFieldClose();
  };

  const tabs = [
    { id: "groups" as TabType, label: "Groupes" },
    { id: "students" as TabType, label: "Étudiants" },
    { id: "fields" as TabType, label: "Filières" },
    { id: "modules" as TabType, label: "Modules" },
    { id: "submodules" as TabType, label: "Sous-modules" },
    { id: "professors" as TabType, label: "Enseignants" },
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Gestion Pédagogique</h1>
      </header>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.content}>
        {activeTab === "groups" && (
          <GroupsTab
            groups={data.groups}
            fields={data.fields}
            modules={data.modules}
            professors={data.professors}
            students={data.allStudents}
            onEdit={(group) => handleEdit("groups", group)}
            onDelete={(group) => handleDelete("groups", group)}
            onAssignStudents={handleAssignStudents}
          />
        )}
        {activeTab === "students" && (
          <StudentsTab
            students={data.allStudents}
            groups={data.groups}
            onEdit={(student) => handleEdit("students", student)}
            onDelete={(student) => handleDelete("students", student)}
          />
        )}
        {activeTab === "fields" && (
          <FieldsTab
            fields={data.fields}
            modules={data.modules}
            subModules={data.subModules}
            groups={data.groups}
            professors={data.professors}
            onEdit={handleFieldEdit}
            onDelete={(field) => handleDelete("fields", field)}
          />
        )}
        {activeTab === "modules" && (
          <ModulesTab
            modules={data.modules}
            fields={data.fields}
            professors={data.professors}
            subModules={data.subModules}
            onEdit={(module) => handleEdit("modules", module)}
            onDelete={(module) => handleDelete("modules", module)}
          />
        )}
        {activeTab === "submodules" && (
          <SubModulesTab
            subModules={data.subModules}
            modules={data.modules}
            fields={data.fields}
            professors={data.professors}
            onEdit={(subModule) => handleEdit("submodules", subModule)}
            onDelete={(subModule) => handleDelete("submodules", subModule)}
          />
        )}
        {activeTab === "professors" && (
          <ProfessorsTab
            professors={data.professors}
            modules={data.modules}
            subModules={data.subModules}
            onEdit={(professor) => handleEdit("professors", professor)}
            onDelete={(professor) => handleDelete("professors", professor)}
          />
        )}
      </div>

      {modalState.isOpen && modalState.type !== 'delete' && (
        <CrudModal
          isOpen={modalState.isOpen}
          type={modalState.type}
          entityType={activeTab}
          entity={modalState.entity}
          fields={data.fields}
          modules={data.modules}
          subModules={data.subModules}
          groups={data.groups}
          onSave={handleSave}
          onClose={handleCloseModal}
          onAssignStudent={handleAssignStudents}
        />
      )}

      <FieldFormModal
        isOpen={fieldModalState.isOpen}
        onClose={handleFieldClose}
        onSubmit={handleFieldSave}
        field={fieldModalState.field}
      />
    </div>
  );
};

export default PedagogicalDashboard;
