import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Group, Professor, Room, Module, Session, Exam } from '../../types/planning';

export type PlanningState = {
  groups: Group[];
  professors: Professor[];
  rooms: Room[];
  modules: Module[];
  sessions: Session[];
  exams: Exam[];
};

const initialState: PlanningState = {
  groups: [
    { id: 1, name: 'GL-1A', field: 'Génie Logiciel' },
    { id: 2, name: 'RT-1A', field: 'Réseaux et Télécom' },
  ],
  professors: [
    { id: 1, name: 'Dr. Smith', email: 'smith@univ.ma' },
    { id: 2, name: 'Dr. Johnson', email: 'johnson@univ.ma' },
  ],
  rooms: [
    { id: 1, name: 'AMPHI1', capacity: 100 },
    { id: 2, name: 'SALLE 1', capacity: 30 },
  ],
  modules: [
    { id: 1, name: 'Programmation Web', type: 'CM', hours: 24 },
    { id: 2, name: 'Bases de données', type: 'TD', hours: 16 },
  ],
  sessions: [
    {
      id: 1,
      groupId: 1,
      moduleId: 1,
      professorId: 1,
      roomId: 1,
      date: '2024-04-10',
      startTime: '08:00',
      endTime: '10:00',
      type: 'CM',
    },
    {
      id: 2,
      groupId: 2,
      moduleId: 2,
      professorId: 2,
      roomId: 2,
      date: '2024-04-11',
      startTime: '10:15',
      endTime: '12:15',
      type: 'TD',
    },
  ],
  exams: [
    {
      id: 1,
      moduleId: 1,
      groupId: 1,
      roomId: 1,
      date: '2024-05-01',
      startTime: '09:00',
      endTime: '12:00',
      supervisorId: 2,
    },
  ],
};

const PlanningContext = createContext<{
  state: PlanningState;
  setState: React.Dispatch<React.SetStateAction<PlanningState>>;
} | undefined>(undefined);

export const PlanningProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PlanningState>(initialState);
  return (
    <PlanningContext.Provider value={{ state, setState }}>
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => {
  const ctx = useContext(PlanningContext);
  if (!ctx) throw new Error('usePlanning must be used within PlanningProvider');
  return ctx;
}; 