import { Session, WeeklySchedule, FieldSchedule, DailyReport, Room, TimeSlot } from '../types/schedule';
import { mockGroups, mockProfessors, mockModules, mockSubModules, mockFields } from './mockData';

// Créneaux horaires standards
export const timeSlots: TimeSlot[] = [
    { startTime: "08:30", endTime: "10:00" },
    { startTime: "10:15", endTime: "11:45" },
    { startTime: "13:30", endTime: "15:00" },
    { startTime: "15:15", endTime: "16:45" }
];

// Salles
export const rooms: Room[] = [
    { id: 1, name: "S101", capacity: 30, type: "Salle de cours" },
    { id: 2, name: "S102", capacity: 30, type: "Salle de cours" },
    { id: 3, name: "L101", capacity: 20, type: "Laboratoire" },
    { id: 4, name: "L102", capacity: 20, type: "Laboratoire" },
    { id: 5, name: "I101", capacity: 25, type: "Salle informatique" },
    { id: 6, name: "I102", capacity: 25, type: "Salle informatique" }
];

// Séances de test
export const mockSessions: Session[] = [
    {
        id: 1,
        startTime: "08:30",
        endTime: "10:00",
        day: "Lundi",
        professor: mockProfessors[0],
        module: mockModules[0],
        room: "S101",
        group: mockGroups[0]
    },
    {
        id: 2,
        startTime: "10:15",
        endTime: "11:45",
        day: "Lundi",
        professor: mockProfessors[1],
        subModule: mockSubModules[0],
        room: "L101",
        group: mockGroups[0]
    },
    {
        id: 3,
        startTime: "13:30",
        endTime: "15:00",
        day: "Lundi",
        professor: mockProfessors[2],
        module: mockModules[1],
        room: "I101",
        group: mockGroups[1]
    }
];

// Emplois du temps hebdomadaires
export const mockWeeklySchedules: WeeklySchedule[] = [
    {
        id: 1,
        group: mockGroups[0],
        sessions: mockSessions.filter(s => s.group.id === mockGroups[0].id),
        weekNumber: 1,
        semester: 1,
        academicYear: "2023-2024"
    },
    {
        id: 2,
        group: mockGroups[1],
        sessions: mockSessions.filter(s => s.group.id === mockGroups[1].id),
        weekNumber: 1,
        semester: 1,
        academicYear: "2023-2024"
    }
];

// Emplois du temps de filière
export const mockFieldSchedules: FieldSchedule[] = [
    {
        id: 1,
        field: mockFields[0],
        weeklySchedules: mockWeeklySchedules.filter(ws => ws.group.fieldId === mockFields[0].id),
        semester: 1,
        academicYear: "2023-2024"
    },
    {
        id: 2,
        field: mockFields[1],
        weeklySchedules: mockWeeklySchedules.filter(ws => ws.group.fieldId === mockFields[1].id),
        semester: 1,
        academicYear: "2023-2024"
    }
];

// Rapports quotidiens
export const mockDailyReports: DailyReport[] = [
    {
        id: 1,
        date: "2024-01-15", // Lundi
        sessions: mockSessions.filter(s => s.day === "Lundi")
    },
    {
        id: 2,
        date: "2024-01-16", // Mardi
        sessions: mockSessions.filter(s => s.day === "Mardi")
    }
];

// Alias pour compatibilité avec le composant FieldScheduleTab
export const mockSchedules = mockFieldSchedules; 