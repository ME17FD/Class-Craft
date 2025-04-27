import { Field, Module, SubModule, Group, Professor, Student } from "../types/type";

export const testFields: Field[] = [
    {
        id: 1,
        name: "Informatique",
        description: "Filière en sciences informatiques"
    },
    {
        id: 2,
        name: "Génie Logiciel",
        description: "Filière en développement logiciel"
    }
];

export const testModules: Module[] = [
    {
        id: 1,
        name: "Programmation",
        code: "INF101",
        fieldId: 1
    },
    {
        id: 2,
        name: "Base de données",
        code: "INF102",
        fieldId: 1
    },
    {
        id: 3,
        name: "Développement Web",
        code: "GL201",
        fieldId: 2
    }
];

export const testSubModules: SubModule[] = [
    {
        id: 1,
        name: "Java",
        hours: 30,
        moduleId: 1
    },
    {
        id: 2,
        name: "Python",
        hours: 25,
        moduleId: 1
    },
    {
        id: 3,
        name: "SQL",
        hours: 20,
        moduleId: 2
    }
];

export const testGroups: Group[] = [
    {
        id: 1,
        name: "Groupe A",
        fieldId: 1,
        students: []
    },
    {
        id: 2,
        name: "Groupe B",
        fieldId: 2,
        students: []
    }
];

export const testProfessors: Professor[] = [
    {
        id: 1,
        name: "Dr. Smith",
        email: "smith@university.edu",
        modules: [1, 2],
        subModules: [1, 2, 3]
    },
    {
        id: 2,
        name: "Dr. Johnson",
        email: "johnson@university.edu",
        modules: [3],
        subModules: [3]
    }
];

export const testStudents: Student[] = [
    {
        id: 1,
        apogee: "2023001",
        cne: "A123456",
        firstName: "John",
        lastName: "Doe",
        groupId: null
    },
    {
        id: 2,
        apogee: "2023002",
        cne: "A123457",
        firstName: "Jane",
        lastName: "Smith",
        groupId: null
    },
    {
        id: 3,
        apogee: "2023003",
        cne: "A123458",
        firstName: "Bob",
        lastName: "Johnson",
        groupId: null
    }
]; 