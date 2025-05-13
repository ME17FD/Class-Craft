import { Group, Professor, Module, SubModule, Field } from './type';

// Type pour une séance
export interface Session {
    dayOfWeek: string;
    id: number;
    startTime: string;
    endTime: string;
    day: string;
    professor: Professor;
    module?: Module;
    subModule?: SubModule;
    classroom: Room;
    group: Group;
    type: 'CM' | 'TD' | 'TP' | 'EXAM' | 'RATTRAPAGE' | 'EVENT';
    professorPresent: boolean;
    duration: number;
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

export interface DailyReport {
    id: number;
    date: string; // Format: "YYYY-MM-DD" (ex: "2023-03-15")
    sessions: Session[];
    validated?: boolean; // Si le rapport a été validé
    createdAt?: string; // Date de création du rapport
    updatedAt?: string; // Date de modification
}
export interface DailyPlanning {
    date: string;
    rooms: RoomOccupation[];
}
export interface RoomOccupation {
    room: string;
    timeSlots: {
        start: string;
        end: string;
        session: Session | null;
    }[];
}
// Type pour les salles
export interface Room {
    id: number;
    name: string;
    capacity: number;
    type: 'Salle de cours' | 'Laboratoire' | 'Salle informatique' |null;
} 



