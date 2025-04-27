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
import usePedagogicalData from "../utils/usePedagogicalData";
import { TabType } from "../types/type";

const PedagogicalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("groups");
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

  const tabs = [
    { id: "groups", label: "Groupes" },
    { id: "students", label: "Étudiants" },
    { id: "fields", label: "Filières" },
    { id: "modules", label: "Modules" },
    { id: "submodules", label: "Sous-modules" },
    { id: "professors", label: "Enseignants" },
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
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAssignStudents={handleAssignStudents}
          />
        )}
        {activeTab === "students" && (
          <StudentsTab
            students={data.allStudents}
            groups={data.groups}
            onEdit={handleEdit}
          />
        )}
        {activeTab === "fields" && (
          <FieldsTab
            fields={data.fields}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {activeTab === "modules" && (
          <ModulesTab
            modules={data.modules}
            fields={data.fields}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {activeTab === "submodules" && (
          <SubModulesTab
            subModules={data.subModules}
            modules={data.modules}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {activeTab === "professors" && (
          <ProfessorsTab
            professors={data.professors}
            modules={data.modules}
            subModules={data.subModules}
            onEdit={handleEdit}
          />
        )}
      </div>

      <CrudModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        entityType={activeTab}
        entity={modalState.entity}
        fields={data.fields}
        modules={data.modules}
        subModules={data.subModules}
        onSave={handleSave}
        onClose={handleCloseModal}
        onAssignStudent={handleAssignStudents}
      />
    </div>
  );
};

export default PedagogicalDashboard;
