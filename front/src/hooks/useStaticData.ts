// src/hooks/useStaticData.ts
import { useState, useCallback } from "react";
import {
  staticStudents,
  staticModules,
  staticSubModules,
  staticFields,
  staticGroups,
  staticProfessors,
  staticRooms,
  staticSessions
} from "../data/scheduleData";
import {

  Session,
  Room
} from "../types/schedule";
import {
    Student,
    Module,
    SubModule,
    Field,
    Group,
    Professor
}from "../types/type";
export const useStaticData = () => {
  // États initiaux avec données statiques
  const [fields, setFields] = useState<Field[]>(staticFields);
  const [modules, setModules] = useState<Module[]>(staticModules);
  const [subModules, setSubModules] = useState<SubModule[]>(staticSubModules);
  const [groups, setGroups] = useState<Group[]>(staticGroups);
  const [professors, setProfessors] = useState<Professor[]>(staticProfessors);
  const [students, setStudents] = useState<Student[]>(staticStudents);
  const [rooms, setRooms] = useState<Room[]>(staticRooms);
  const [sessions, setSessions] = useState<Session[]>(staticSessions);

  // Fonctions CRUD complètes

  // --- Fields ---
  const addField = useCallback(async (field: Field) => {
    setFields(prev => [...prev, { ...field, id: Date.now() }]);
  }, []);

  const updateField = useCallback(async (field: Field) => {
    setFields(prev => prev.map(f => f.id === field.id ? field : f));
  }, []);

  const deleteField = useCallback(async (fieldId: number) => {
    setFields(prev => prev.filter(f => f.id !== fieldId));
    setModules(prev => prev.filter(m => m.fieldId !== fieldId));
  }, []);

  // --- Modules ---
  const addModule = useCallback(async (module: Module) => {
    setModules(prev => [...prev, { ...module, id: Date.now() }]);
  }, []);

  const updateModule = useCallback(async (module: Module) => {
    setModules(prev => prev.map(m => m.id === module.id ? module : m));
  }, []);

  const deleteModule = useCallback(async (moduleId: number) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
    setSubModules(prev => prev.filter(sm => sm.moduleId !== moduleId));
  }, []);

  // --- SubModules ---
  const addSubModule = useCallback(async (subModule: SubModule) => {
    setSubModules(prev => [...prev, { ...subModule, id: Date.now() }]);
  }, []);

  const updateSubModule = useCallback(async (subModule: SubModule) => {
    setSubModules(prev => prev.map(sm => sm.id === subModule.id ? subModule : sm));
  }, []);

  const deleteSubModule = useCallback(async (subModuleId: number) => {
    setSubModules(prev => prev.filter(sm => sm.id !== subModuleId));
  }, []);

  // --- Groups ---
  const addGroup = useCallback(async (group: Group) => {
    setGroups(prev => [...prev, { ...group, id: Date.now() }]);
  }, []);

  const updateGroup = useCallback(async (group: Group) => {
    setGroups(prev => prev.map(g => g.id === group.id ? group : g));
  }, []);

  const deleteGroup = useCallback(async (groupId: number) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setStudents(prev => prev.map(s => 
      s.groupId === groupId ? { ...s, groupId: null } : s
    ));
  }, []);

  // --- Professors ---
  const addProfessor = useCallback(async (professor: Professor) => {
    setProfessors(prev => [...prev, { ...professor, id: Date.now() }]);
  }, []);

  const updateProfessor = useCallback(async (professor: Professor) => {
    setProfessors(prev => prev.map(p => p.id === professor.id ? professor : p));
  }, []);

  const deleteProfessor = useCallback(async (professorId: number) => {
    setProfessors(prev => prev.filter(p => p.id !== professorId));
  }, []);

  // --- Students ---
  const addStudent = useCallback(async (student: Student) => {
    setStudents(prev => [...prev, { ...student, id: Date.now() }]);
  }, []);

  const updateStudent = useCallback(async (student: Student) => {
    setStudents(prev => prev.map(s => s.id === student.id ? student : s));
  }, []);

  const deleteStudent = useCallback(async (studentId: number) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  }, []);

  // --- Rooms ---
  const addRoom = useCallback(async (room: Room) => {
    setRooms(prev => [...prev, { ...room, id: Date.now() }]);
  }, []);

  const updateRoom = useCallback(async (room: Room) => {
    setRooms(prev => prev.map(r => r.id === room.id ? room : r));
  }, []);

  const deleteRoom = useCallback(async (roomId: number) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
  }, []);

  // --- Sessions ---
  const addSession = useCallback(async (session: Session) => {
    setSessions(prev => [...prev, { ...session, id: Date.now() }]);
  }, []);

  const updateSession = useCallback(async (session: Session) => {
    setSessions(prev => prev.map(s => s.id === session.id ? session : s));
  }, []);

  const deleteSession = useCallback(async (sessionId: number) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  }, []);

  return {
    // Data
    fields,
    modules,
    subModules,
    groups,
    professors,
    students,
    rooms,
    sessions,

    // CRUD Functions
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
    addRoom,
    updateRoom,
    deleteRoom,
    addSession,
    updateSession,
    deleteSession
  };
};