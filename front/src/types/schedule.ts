import { Group, Professor, Module, SubModule, Field } from './type';

// Type pour une séance
export interface Session {
    id: number;
    startTime: string; // Format: "HH:mm"
    endTime: string; // Format: "HH:mm"
    day: string;
    professor: Professor;
    module?: Module;
    subModule?: SubModule;
    room: string;
    group: Group;
}

// Type pour un emploi du temps hebdomadaire
export interface WeeklySchedule {
    id: number;
    group: Group;
    sessions: Session[];
    weekNumber: number; // Numéro de la semaine
    semester: number; // 1 ou 2
    academicYear: string; // Format: "2023-2024"
}

// Type pour un emploi du temps de filière
export interface FieldSchedule {
    id: number;
    field: Field;
    weeklySchedules: WeeklySchedule[];
    semester: number;
    academicYear: string;
}

// Type pour un rapport quotidien
export interface DailyReport {
    id: number;
    date: string; // Format: "YYYY-MM-DD"
    sessions: Session[];
}

// Type pour les créneaux horaires
export interface TimeSlot {
    startTime: string;
    endTime: string;
}

// Type pour les salles
export interface Room {
    id: number;
    name: string;
    capacity: number;
    type: 'Salle de cours' | 'Laboratoire' | 'Salle informatique';
} 