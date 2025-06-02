import React, { useEffect, useState } from "react";
import ApprovalDashboard from "./ApprouvalDashbaord";
import { useApiData } from "../hooks/useApiData";
import { Student, Professor } from "../types/type";

const ApprovalManager: React.FC = () => {
  const {
    students,
    professors,
    updateStudent,
    deleteStudent,
    updateProfessor,
    deleteProfessor,
    fetchData,
  } = useApiData();

  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [pendingProfessors, setPendingProfessors] = useState<Professor[]>([]);

  // Filtrer les utilisateurs non approuvés
  useEffect(() => {
    // Filtrer SEULEMENT ceux avec approved === null (en attente d'approbation)
    const unapprovedStudents = students.filter(
      (student) => student.approved === null
    );

    const unapprovedProfessors = professors.filter(
      (professor) => professor.approved === null
    );

    console.log(
      `${unapprovedStudents.length} étudiants en attente d'approbation`
    );
    console.log(
      `${unapprovedProfessors.length} professeurs en attente d'approbation`
    );

    setPendingStudents(unapprovedStudents);
    setPendingProfessors(unapprovedProfessors);
  }, [students, professors]);

  // Gestion de l'approbation des étudiants
  const handleApproveStudent = async (studentId: number) => {
    try {
      const student = students.find((s) => s.id === studentId);
      if (student) {
        await updateStudent({ ...student, approved: true });
        fetchData(); // Rafraîchir les données
      }
    } catch (error) {
      console.error("Failed to approve student:", error);
    }
  };

  const handleRejectStudent = async (studentId: number) => {
    try {
      await deleteStudent(studentId);
      fetchData(); // Rafraîchir les données
    } catch (error) {
      console.error("Failed to reject student:", error);
    }
  };

  // Gestion de l'approbation des professeurs
  const handleApproveProfessor = async (professorId: number) => {
    try {
      const professor = professors.find((p) => p.id === professorId);
      if (professor) {
        await updateProfessor({ ...professor, approved: true });
        fetchData(); // Rafraîchir les données
      }
    } catch (error) {
      console.error("Failed to approve professor:", error);
    }
  };

  const handleRejectProfessor = async (professorId: number) => {
    try {
      await deleteProfessor(professorId);
      fetchData(); // Rafraîchir les données
    } catch (error) {
      console.error("Failed to reject professor:", error);
    }
  };

  return (
    <ApprovalDashboard
      pendingStudents={pendingStudents}
      pendingProfessors={pendingProfessors}
      onApproveStudent={handleApproveStudent}
      onRejectStudent={handleRejectStudent}
      onApproveProfessor={handleApproveProfessor}
      onRejectProfessor={handleRejectProfessor}
    />
  );
};

export default ApprovalManager;
