import { useState, useEffect, useCallback } from "react";
import api from "../services/api"; // your path to the api.ts file
import axios, { AxiosError, AxiosResponse } from "axios";

import {
  Field,
  Module,
  SubModule,
  Group,
  Professor,
  Student,
} from "../types/type";

import { Session } from "../types/schedule";

export const useApiData = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [subModules, setSubModules] = useState<SubModule[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [seances, setSeances] = useState<Session[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Initiating API requests...");
      
      try {
        const endpoints = [
          { name: "filieres", url: "/api/filieres" },
          { name: "modules", url: "/api/modules" },
          { name: "submodules", url: "/api/submodules" },
          { name: "groups", url: "/api/groups" },
          { name: "professors", url: "/api/professors" },
          { name: "students", url: "/api/students" },
          { name: "seances", url: "/api/seances" },
        ];
  
        // Create requests with enhanced logging
        const requests = endpoints.map(endpoint => 
          api.get(endpoint.url)
            .then(response => {
              console.log(`✅ Success [${endpoint.name}]:`, {
                status: response.status,
                data: response.data,
                headers: response.headers
              });
              return response;
            })
            .catch(error => {
              console.error(`❌ Failed [${endpoint.name}]:`, {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                config: {
                  url: error.config?.url,
                  headers: error.config?.headers
                }
              });
              throw error; // Re-throw to trigger catch block
            })
        );
  
        const results = await Promise.allSettled(requests);
  
        // Process successful responses
        const successful = results.filter(r => r.status === "fulfilled") as PromiseFulfilledResult<AxiosResponse>[];
        
        // Handle failed requests
        const failed = results.filter(r => r.status === "rejected") as PromiseRejectedResult[];
        if (failed.length > 0) {
          console.groupCollapsed("Failed API Requests");
          failed.forEach((f, i) => {
            const error = f.reason as AxiosError;
            console.error(`Request ${i + 1} failed:`, {
              endpoint: endpoints[i].name,
              status: error.response?.status,
              message: error.message,
              responseData: error.response?.data
            });
          });
          console.groupEnd();
        }
  
        // Update state only with successful responses
        successful.forEach(result => {
          const endpointName = endpoints.find(e => 
            e.url === result.value.config.url
          )?.name;
          
          switch (endpointName) {
            case "filieres": setFields(result.value.data); break;
            case "modules": setModules(result.value.data); break;
            case "submodules": setSubModules(result.value.data); break;
            case "groups": setGroups(result.value.data); break;
            case "professors": setProfessors(result.value.data); break;
            case "students": setStudents(result.value.data); break;
            case "seances": setSeances(result.value.data); break;
          }
        });
  
      } catch (error) {
        console.error("Global error handler:", {
          error,
          stringified: JSON.stringify(error, Object.getOwnPropertyNames(error))
        });
      }
    };
  
    fetchData();
  }, []);

  // ----- CRUD: Fields -----
  const addField = useCallback(async (field: Field) => {
    const res = await axios.post("/api/fields", field);
    setFields(prev => [...prev, res.data]);
  }, []);

  const updateField = useCallback(async (field: Field) => {
    await axios.put(`/api/fields/${field.id}`, field);
    setFields(prev => prev.map(f => f.id === field.id ? field : f));
  }, []);

  const deleteField = useCallback(async (fieldId: number) => {
    await axios.delete(`/api/fields/${fieldId}`);
    setFields(prev => prev.filter(f => f.id !== fieldId));
  }, []);

  // ----- CRUD: Modules -----
  const addModule = useCallback(async (module: Module) => {
    const res = await axios.post("/api/modules", module);
    setModules(prev => [...prev, res.data]);
  }, []);

  const updateModule = useCallback(async (module: Module) => {
    await axios.put(`/api/modules/${module.id}`, module);
    setModules(prev => prev.map(m => m.id === module.id ? module : m));
  }, []);

  const deleteModule = useCallback(async (moduleId: number) => {
    await axios.delete(`/api/modules/${moduleId}`);
    setModules(prev => prev.filter(m => m.id !== moduleId));
  }, []);

  // ----- CRUD: SubModules -----
  const addSubModule = useCallback(async (subModule: SubModule) => {
    const res = await axios.post("/api/submodules", subModule);
    setSubModules(prev => [...prev, res.data]);
  }, []);

  const updateSubModule = useCallback(async (subModule: SubModule) => {
    await axios.put(`/api/submodules/${subModule.id}`, subModule);
    setSubModules(prev => prev.map(s => s.id === subModule.id ? subModule : s));
  }, []);

  const deleteSubModule = useCallback(async (subModuleId: number) => {
    await axios.delete(`/api/submodules/${subModuleId}`);
    setSubModules(prev => prev.filter(s => s.id !== subModuleId));
  }, []);

  // ----- CRUD: Groups (already included in your version) -----
  const addGroup = useCallback(async (group: Group) => {
    const res = await axios.post("/api/groups", group);
    setGroups(prev => [...prev, res.data]);
  }, []);

  const updateGroup = useCallback(async (group: Group) => {
    await axios.put(`/api/groups/${group.id}`, group);
    setGroups(prev => prev.map(g => g.id === group.id ? group : g));
  }, []);

  const deleteGroup = useCallback(async (groupId: number) => {
    await axios.delete(`/api/groups/${groupId}`);
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setStudents(prev => prev.map(s => s.groupId === groupId ? { ...s, groupId: null } : s));
  }, []);

  // ----- CRUD: Professors -----
  const addProfessor = useCallback(async (prof: Professor) => {
    const res = await axios.post("/api/professors", prof);
    setProfessors(prev => [...prev, res.data]);
  }, []);

  const updateProfessor = useCallback(async (prof: Professor) => {
    await axios.put(`/api/professors/${prof.id}`, prof);
    setProfessors(prev => prev.map(p => p.id === prof.id ? prof : p));
  }, []);

  const deleteProfessor = useCallback(async (profId: number) => {
    await axios.delete(`/api/professors/${profId}`);
    setProfessors(prev => prev.filter(p => p.id !== profId));
  }, []);

  // ----- CRUD: Students -----
  const addStudent = useCallback(async (student: Student) => {
    const res = await axios.post("/api/students", student);
    setStudents(prev => [...prev, res.data]);
  }, []);

  const updateStudent = useCallback(async (student: Student) => {
    await axios.put(`/api/students/${student.id}`, student);
    setStudents(prev => prev.map(s => s.id === student.id ? student : s));
  }, []);

  const deleteStudent = useCallback(async (studentId: number) => {
    await axios.delete(`/api/students/${studentId}`);
    setStudents(prev => prev.filter(s => s.id !== studentId));
  }, []);

  // ----- CRUD: Seances -----
const addSeance = useCallback(async (seance: Session) => {
  const res = await axios.post("/api/seances", seance);
  setSeances(prev => [...prev, res.data]);
}, []);

const updateSeance = useCallback(async (seance: Session) => {
  await axios.put(`/api/seances/${seance.id}`, seance);
  setSeances(prev => prev.map(s => s.id === seance.id ? seance : s));
}, []);

const deleteSeance = useCallback(async (seanceId: number) => {
  await axios.delete(`/api/seances/${seanceId}`);
  setSeances(prev => prev.filter(s => s.id !== seanceId));
}, []);


  return {
    seances,
    addSeance,
    updateSeance,
    deleteSeance,
    fields,
    modules,
    subModules,
    groups,
    professors,
    students,
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
    deleteStudent
  };
};
