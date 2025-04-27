import { useState, useCallback } from 'react';
import { Field, Module, SubModule, Group, Professor, Student } from '../types/type';
import { mockFields, mockModules, mockSubModules, mockGroups, mockProfessors, mockStudents } from '../data/mockData';

export const useMockData = () => {
    const [fields, setFields] = useState<Field[]>(mockFields);
    const [modules, setModules] = useState<Module[]>(mockModules);
    const [subModules, setSubModules] = useState<SubModule[]>(mockSubModules);
    const [groups, setGroups] = useState<Group[]>(mockGroups);
    const [professors, setProfessors] = useState<Professor[]>(mockProfessors);
    const [students, setStudents] = useState<Student[]>(mockStudents);

    // Fonctions pour gérer les filières
    const addField = useCallback((field: Field) => {
        setFields(prev => [...prev, { ...field, id: prev.length > 0 ? Math.max(...prev.map(f => f.id)) + 1 : 1 }]);
    }, []);

    const updateField = useCallback((field: Field) => {
        setFields(prev => prev.map(f => f.id === field.id ? field : f));
    }, []);

    const deleteField = useCallback((fieldId: number) => {
        setFields(prev => prev.filter(f => f.id !== fieldId));
    }, []);

    // Fonctions pour gérer les modules
    const addModule = useCallback((module: Module) => {
        setModules(prev => [...prev, { ...module, id: prev.length > 0 ? Math.max(...prev.map(m => m.id)) + 1 : 1 }]);
    }, []);

    const updateModule = useCallback((module: Module) => {
        setModules(prev => prev.map(m => m.id === module.id ? module : m));
    }, []);

    const deleteModule = useCallback((moduleId: number) => {
        setModules(prev => prev.filter(m => m.id !== moduleId));
    }, []);

    // Fonctions pour gérer les sous-modules
    const addSubModule = useCallback((subModule: SubModule) => {
        setSubModules(prev => [...prev, { ...subModule, id: prev.length > 0 ? Math.max(...prev.map(sm => sm.id)) + 1 : 1 }]);
    }, []);

    const updateSubModule = useCallback((subModule: SubModule) => {
        setSubModules(prev => prev.map(sm => sm.id === subModule.id ? subModule : sm));
    }, []);

    const deleteSubModule = useCallback((subModuleId: number) => {
        setSubModules(prev => prev.filter(sm => sm.id !== subModuleId));
    }, []);

    // Fonctions pour gérer les groupes
    const addGroup = useCallback((group: Group) => {
        setGroups(prev => [...prev, { ...group, id: prev.length > 0 ? Math.max(...prev.map(g => g.id)) + 1 : 1 }]);
    }, []);

    const updateGroup = useCallback((group: Group) => {
        setGroups(prev => prev.map(g => g.id === group.id ? group : g));
    }, []);

    const deleteGroup = useCallback((groupId: number) => {
        setGroups(prev => prev.filter(g => g.id !== groupId));
        // Mettre à jour les étudiants du groupe
        setStudents(prev => prev.map(s => s.groupId === groupId ? { ...s, groupId: null } : s));
    }, []);

    // Fonctions pour gérer les professeurs
    const addProfessor = useCallback((professor: Professor) => {
        setProfessors(prev => [...prev, { ...professor, id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 1 }]);
    }, []);

    const updateProfessor = useCallback((professor: Professor) => {
        setProfessors(prev => prev.map(p => p.id === professor.id ? professor : p));
    }, []);

    const deleteProfessor = useCallback((professorId: number) => {
        setProfessors(prev => prev.filter(p => p.id !== professorId));
    }, []);

    // Fonctions pour gérer les étudiants
    const addStudent = useCallback((student: Student) => {
        setStudents(prev => [...prev, { ...student, id: prev.length > 0 ? Math.max(...prev.map(s => s.id)) + 1 : 1 }]);
    }, []);

    const updateStudent = useCallback((student: Student) => {
        setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    }, []);

    const deleteStudent = useCallback((studentId: number) => {
        setStudents(prev => prev.filter(s => s.id !== studentId));
    }, []);

    // Fonction pour ajouter un étudiant à un groupe
    const addStudentToGroup = useCallback((groupId: number, studentId: number) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, groupId } : s));
    }, []);

    // Fonction pour retirer un étudiant d'un groupe
    const removeStudentFromGroup = useCallback((groupId: number, studentId: number) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, groupId: null } : s));
    }, []);

    return {
        // Données
        fields,
        modules,
        subModules,
        groups,
        professors,
        students,
        // Fonctions pour les filières
        addField,
        updateField,
        deleteField,
        // Fonctions pour les modules
        addModule,
        updateModule,
        deleteModule,
        // Fonctions pour les sous-modules
        addSubModule,
        updateSubModule,
        deleteSubModule,
        // Fonctions pour les groupes
        addGroup,
        updateGroup,
        deleteGroup,
        // Fonctions pour les professeurs
        addProfessor,
        updateProfessor,
        deleteProfessor,
        // Fonctions pour les étudiants
        addStudent,
        updateStudent,
        deleteStudent,
        // Fonctions pour la gestion des groupes
        addStudentToGroup,
        removeStudentFromGroup
    };
}; 