import React, { useState } from "react";
import styles from "../styles/ApprovalDashboard.module.css";
import TabNav from "./PedagogicalDashboard-components/TabNav";
import Table from "./PedagogicalDashboard-components/TableActions";
import Sidebar from "./Sidebar";
import { Professor, Student } from "../types/type";

interface ApprovalDashboardProps {
  pendingStudents: Student[];
  pendingProfessors: Professor[];
  onApproveStudent: (studentId: number) => void;
  onRejectStudent: (studentId: number) => void;
  onApproveProfessor: (professorId: number) => void;
  onRejectProfessor: (professorId: number) => void;
}

type ApprovalTabType = "students" | "professors";

const ApprovalDashboard: React.FC<ApprovalDashboardProps> = ({
  pendingStudents,
  pendingProfessors,
  onApproveStudent,
  onRejectStudent,
  onApproveProfessor,
  onRejectProfessor,
}) => {
  const [activeTab, setActiveTab] = useState<ApprovalTabType>("students");

  const tabs = [
    { id: "students" as ApprovalTabType, label: "Étudiants en attente" },
    { id: "professors" as ApprovalTabType, label: "Enseignants en attente" },
  ];

  // Colonnes pour la table des étudiants
  const studentColumns = [
    { header: "ID", accessor: "id" },
    { header: "Nom", accessor: "lastName" },
    { header: "Prénom", accessor: "firstName" },
    { header: "Email", accessor: "email" },
    {
      header: "Actions",
      render: (student: Student) => (
        <div className={styles.actionButtons}>
          <button
            className={`${styles.button} ${styles.approveButton}`}
            onClick={() => onApproveStudent(student.id)}>
            Approuver
          </button>
          <button
            className={`${styles.button} ${styles.rejectButton}`}
            onClick={() => onRejectStudent(student.id)}>
            Refuser
          </button>
        </div>
      ),
    },
  ];

  // Colonnes pour la table des professeurs
  const professorColumns = [
    { header: "ID", accessor: "id" },
    { header: "Nom", accessor: "lastName" },
    { header: "Prénom", accessor: "firstName" },
    { header: "Email", accessor: "email" },
    {
      header: "Actions",
      render: (professor: Professor) => (
        <div className={styles.actionButtons}>
          <button
            className={`${styles.button} ${styles.approveButton}`}
            onClick={() => onApproveProfessor(professor.id)}>
            Approuver
          </button>
          <button
            className={`${styles.button} ${styles.rejectButton}`}
            onClick={() => onRejectProfessor(professor.id)}>
            Refuser
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Sidebar />
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Approbations en attente</h1>
        </header>

        <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className={styles.content}>
          {activeTab === "students" && (
            <Table
              data={pendingStudents}
              columns={studentColumns}
              emptyMessage="Aucun étudiant en attente d'approbation"
            />
          )}

          {activeTab === "professors" && (
            <Table
              data={pendingProfessors}
              columns={professorColumns}
              emptyMessage="Aucun enseignant en attente d'approbation"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ApprovalDashboard;
