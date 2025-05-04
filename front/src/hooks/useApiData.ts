import { useState, useEffect, useCallback } from "react";
import api from "../services/api"; // your api service
import { AxiosError } from "axios";
import {
  Field,
  Module,
  SubModule,
  Group,
  Professor,
  Student,
} from "../types/type";

export const useApiData = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [subModules, setSubModules] = useState<SubModule[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
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
      ];

      const requests = endpoints.map(endpoint => 
        api.get(endpoint.url)
          .then(response => {
            console.log(`✅ Success [${endpoint.name}]:`, response.data);
            return response;
          })
          .catch(error => {
            console.error(`❌ Failed [${endpoint.name}]:`, error);
            throw error;
          })
      );

      const results = await Promise.allSettled(requests);

      const successful = results.filter(r => r.status === "fulfilled") as PromiseFulfilledResult<any>[];
      const failed = results.filter(r => r.status === "rejected") as PromiseRejectedResult[];
      
      if (failed.length > 0) {
        console.group("Failed API Requests");
        failed.forEach((f, i) => {
          const error = f.reason as AxiosError;
          console.error(`Request ${i + 1} failed:`, {
            endpoint: endpoints[i].name,
            status: error.response?.status,
            message: error.message,
          });
        });
        console.groupEnd();
      }

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
        }
      });

    } catch (error) {
      console.error("Global error handler:", error);
    }
  };

  useEffect(() => {
    
  
    fetchData();
  }, []);

  // ----- CRUD: Fields -----
  const addField = useCallback(async (field: Field) => {
    const res = await api.post("/api/filieres", field);
    setFields(prev => [...prev, res.data]);
    return res.data;
  }, []);

  const updateField = useCallback(async (field: Field) => {
    await api.put(`/api/filieres/${field.id}`, field);
    setFields(prev => prev.map(f => f.id === field.id ? field : f));
  }, []);

  const deleteField = useCallback(async (fieldId: number) => {
    await api.delete(`/api/filieres/${fieldId}`);
    setFields(prev => prev.filter(f => f.id !== fieldId));
  }, []);

  // ----- CRUD: Modules -----
  const addModule = useCallback(async (module: Module) => {
    const res = await api.post("/api/modules", module);
    setModules(prev => [...prev, res.data]);
    return res.data;
  }, []);

  const updateModule = useCallback(async (module: Module) => {
    await api.put(`/api/modules/${module.id}`, module);
    setModules(prev => prev.map(m => m.id === module.id ? module : m));
  }, []);

  const deleteModule = useCallback(async (moduleId: number) => {
    await api.delete(`/api/modules/${moduleId}`);
    setModules(prev => prev.filter(m => m.id !== moduleId));
  }, []);

  // ----- CRUD: SubModules -----
  const addSubModule = useCallback(async (subModule: SubModule) => {
    const res = await api.post("/api/submodules", subModule);
    setSubModules(prev => [...prev, res.data]);
    return res.data;
  }, []);

  const updateSubModule = useCallback(async (subModule: SubModule) => {
    await api.put(`/api/submodules/${subModule.id}`, subModule);
    setSubModules(prev => prev.map(s => s.id === subModule.id ? subModule : s));
  }, []);

  const deleteSubModule = useCallback(async (subModuleId: number) => {
    await api.delete(`/api/submodules/${subModuleId}`);
    setSubModules(prev => prev.filter(s => s.id !== subModuleId));
  }, []);

  // ----- CRUD: Groups -----
  const addGroup = useCallback(async (group: Omit<Group, 'id'>) => {
    try {
      const res = await api.post("/api/groups", group);
      setGroups(prev => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.error("Failed to create group:", error);
      throw error;
    }
  }, []);

  const updateGroup = useCallback(async (group: Group): Promise<boolean> => {
    try {
      const res = await api.put(`/api/groups/${group.id}`, group);
      setGroups(prev => prev.map(g => g.id === group.id ? res.data : g));
      return true;  // Return true if the update is successful
    } catch (error) {
      console.error("Failed to update group:", error);
      return false;  // Return false if an error occurs
    }
  }, []);

  const deleteGroup = useCallback(
    async (groupId: number): Promise<boolean> => {
      try {
        await api.delete(`/api/groups/${groupId}`);
        setGroups(prev => prev.filter(g => g.id !== groupId));
        setStudents(prev =>
          prev.map(s => (s.groupId === groupId ? { ...s, groupId: null } : s))
        );
        return true;
      } catch (error) {
        console.error("Failed to delete group:", error);
        return false;
      }
    },
    [setGroups, setStudents]
  );
  

  // ----- CRUD: Professors -----
  const addProfessor = useCallback(async (prof: Professor) => {
    const res = await api.post("/api/professors", prof);
    setProfessors(prev => [...prev, res.data]);
    return res.data;
  }, []);

  const updateProfessor = useCallback(async (prof: Professor) => {
    await api.put(`/api/professors/${prof.id}`, prof);
    setProfessors(prev => prev.map(p => p.id === prof.id ? prof : p));
  }, []);

  const deleteProfessor = useCallback(async (profId: number) => {
    await api.delete(`/api/professors/${profId}`);
    setProfessors(prev => prev.filter(p => p.id !== profId));
  }, []);

  // ----- CRUD: Students -----
  const addStudent = useCallback(async (student: Student) => {
    const res = await api.post("/api/students", student);
    setStudents(prev => [...prev, res.data]);
    return res.data;
  }, []);

  const updateStudent = useCallback(async (student: Student) => {
    await api.put(`/api/students/${student.id}`, student);
    setStudents(prev => prev.map(s => s.id === student.id ? student : s));
  }, []);

  const deleteStudent = useCallback(async (studentId: number) => {
    await api.delete(`/api/students/${studentId}`);
    setStudents(prev => prev.filter(s => s.id !== studentId));
  }, []);

  return {
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
    deleteStudent,
    fetchData
  };
};