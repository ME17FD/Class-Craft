import { 
    
    Session, 
    Room 
  } from "../types/schedule";
import {Student, 
    Module, 
    SubModule, 
    Field, 
    Professor, 
    Group } from "../types/type";
  export const staticStudents: Student[] = [
    {
      id: 1,
      cne: "G123456",
      registrationNumber: "2023-001",
      lastName: "Dupont",
      firstName: "Jean",
      groupId: 1,
      email: "jean.dupont@edu.um"
    },
    {
      id: 2,
      cne: "G654321",
      registrationNumber: "2023-002",
      lastName: "Martin",
      firstName: "Sophie",
      groupId: 1
    }
  ];
  
  export const staticModules: Module[] = [
    {
      id: 1,
      name: "Algorithmique",
      code: "ALGO-101",
      fieldId: 1
    },
    {
      id: 2,
      name: "Base de données",
      code: "BD-201",
      fieldId: 1
    }
  ];
  
  export const staticSubModules: SubModule[] = [
    {
      id: 1,
      name: "Structures de données",
      hours: 30,
      moduleId: 1
    },
    {
      id: 2,
      name: "SQL Avancé",
      hours: 20,
      moduleId: 2
    }
  ];
  
  export const staticFields: Field[] = [
    {
      id: 1,
      name: "Informatique",
      description: "Filière en sciences informatiques"
    }
  ];
  
  export const staticProfessors: Professor[] = [
    {
      id: 1,
      name: "Dr. Smith",
      email: "smith@um.ac.ma",
      modules: [1],
      subModules: [1]
    },
    {
      id: 2,
      name: "Pr. Johnson",
      email: "johnson@um.ac.ma",
      modules: [2],
      subModules: [2]
    }
  ];
  
  export const staticGroups: Group[] = [
    {
      id: 1,
      name: "Groupe A",
      filiereId: 1,
      students: staticStudents.filter(s => s.groupId === 1)
    }
  ];
  
  export const staticRooms: Room[] = [
    {
      id: 1,
      name: "B203",
      capacity: 30,
      type: "Salle de cours"
    },
    {
      id: 2,
      name: "Labo Info 1",
      capacity: 20,
      type: "Salle informatique"
    }
  ];
  
  export const staticSessions: Session[] = [
    {
      id: 1,
      startTime: "08:00",
      endTime: "10:00",
      day: "Lundi",
      professor: staticProfessors[0],
      module: staticModules[0],
      subModule: staticSubModules[0],
      room: "B203",
      group: staticGroups[0],
      professorPresent: true
    },
    {
      id: 2,
      startTime: "14:00",
      endTime: "16:00",
      day: "Mardi",
      professor: staticProfessors[1],
      module: staticModules[1],
      room: "Labo Info 1",
      group: staticGroups[0],
      professorPresent: false
    }
  ];
  
  export const staticDailyReports = [
    {
      id: 1,
      date: "2023-10-01",
      sessions: staticSessions
    }
  ];