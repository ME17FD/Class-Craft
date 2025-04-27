export type Group = {
    id: number;
    name: string;
    field: string;
};

export type Professor = {
    id: number;
    name: string;
    email?: string;
};

export type Room = {
    id: number;
    name: string;
    capacity?: number;
};

export type Module = {
    id: number;
    name: string;
    type: 'CM' | 'TD' | 'TP';
    hours: number;
};

export type Session = {
    id: number;
    groupId: number;
    moduleId: number;
    professorId: number;
    roomId: number;
    date: string;
    startTime: string;
    endTime: string;
    type: 'CM' | 'TD' | 'TP' | 'RATTRAPAGE' | 'EXAMEN';
};

export type Exam = {
    id: number;
    moduleId: number;
    groupId: number;
    roomId: number;
    date: string;
    startTime: string;
    endTime: string;
    supervisorId: number;
}; 