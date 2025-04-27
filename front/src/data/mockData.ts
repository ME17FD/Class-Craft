import { Field, Module, SubModule, Group, Professor, Student } from "../types/type";

// Étudiants
export const mockStudents: Student[] = [
    {
        id: 1,
        cne: "E001",
        apogee: "A001",
        lastName: "Alami",
        firstName: "Youssef",
        groupId: 1
    },
    {
        id: 2,
        cne: "E002",
        apogee: "A002",
        lastName: "Benjelloun",
        firstName: "Fatima",
        groupId: 1
    },
    {
        id: 3,
        cne: "E003",
        apogee: "A003",
        lastName: "Idrissi",
        firstName: "Karim",
        groupId: 2
    },
    {
        id: 4,
        cne: "E004",
        apogee: "A004",
        lastName: "Hassani",
        firstName: "Samira",
        groupId: 2
    },
    {
        id: 5,
        cne: "E005",
        apogee: "A005",
        lastName: "El Fassi",
        firstName: "Mehdi",
        groupId: 3
    },
    {
        id: 6,
        cne: "E006",
        apogee: "A006",
        lastName: "Benali",
        firstName: "Leila",
        groupId: 3
    },
    {
        id: 7,
        cne: "E007",
        apogee: "A007",
        lastName: "Alami",
        firstName: "Ahmed",
        groupId: 4
    },
    {
        id: 8,
        cne: "E008",
        apogee: "A008",
        lastName: "Benjelloun",
        firstName: "Youssef",
        groupId: 4
    },
    {
        id: 9,
        cne: "E009",
        apogee: "A009",
        lastName: "Idrissi",
        firstName: "Fatima",
        groupId: 5
    },
    {
        id: 10,
        cne: "E010",
        apogee: "A010",
        lastName: "Hassani",
        firstName: "Karim",
        groupId: 5
    },
    {
        id: 11,
        cne: "E011",
        apogee: "A011",
        lastName: "El Fassi",
        firstName: "Samira",
        groupId: 6
    },
    {
        id: 12,
        cne: "E012",
        apogee: "A012",
        lastName: "Benali",
        firstName: "Mehdi",
        groupId: 6
    },
    // Étudiants non assignés
    {
        id: 13,
        cne: "E013",
        apogee: "A013",
        lastName: "Alami",
        firstName: "Leila",
        groupId: null
    },
    {
        id: 14,
        cne: "E014",
        apogee: "A014",
        lastName: "Benjelloun",
        firstName: "Ahmed",
        groupId: null
    }
];

// Filières
export const mockFields: Field[] = [
    {
        id: 1,
        name: "Génie Logiciel",
        description: "Formation en développement logiciel et applications"
    },
    {
        id: 2,
        name: "Réseaux et Télécommunications",
        description: "Formation en réseaux et télécommunications"
    },
    {
        id: 3,
        name: "Intelligence Artificielle",
        description: "Formation en IA et science des données"
    }
];

// Modules
export const mockModules: Module[] = [
    {
        id: 1,
        name: "Programmation Web",
        code: "WEB101",
        fieldId: 1
    },
    {
        id: 2,
        name: "Bases de données",
        code: "DB101",
        fieldId: 1
    },
    {
        id: 3,
        name: "Architecture Logicielle",
        code: "ARCH101",
        fieldId: 1
    },
    {
        id: 4,
        name: "Réseaux Locaux",
        code: "NET101",
        fieldId: 2
    },
    {
        id: 5,
        name: "Télécommunications",
        code: "TEL101",
        fieldId: 2
    },
    {
        id: 6,
        name: "Sécurité Réseaux",
        code: "SEC101",
        fieldId: 2
    },
    {
        id: 7,
        name: "Machine Learning",
        code: "ML101",
        fieldId: 3
    },
    {
        id: 8,
        name: "Deep Learning",
        code: "DL101",
        fieldId: 3
    },
    {
        id: 9,
        name: "Traitement du Langage Naturel",
        code: "NLP101",
        fieldId: 3
    }
];

// Sous-modules
export const mockSubModules: SubModule[] = [
    {
        id: 1,
        name: "HTML/CSS",
        moduleId: 1,
        hours: 30
    },
    {
        id: 2,
        name: "JavaScript/React",
        moduleId: 1,
        hours: 30
    },
    {
        id: 3,
        name: "SQL",
        moduleId: 2,
        hours: 25
    },
    {
        id: 4,
        name: "Patterns de Conception",
        moduleId: 3,
        hours: 20
    },
    {
        id: 5,
        name: "Configuration Réseau",
        moduleId: 4,
        hours: 25
    },
    {
        id: 6,
        name: "Protocoles",
        moduleId: 5,
        hours: 30
    },
    {
        id: 7,
        name: "Voix sur IP",
        moduleId: 5,
        hours: 25
    },
    {
        id: 8,
        name: "Cryptographie",
        moduleId: 6,
        hours: 20
    },
    {
        id: 9,
        name: "Supervised Learning",
        moduleId: 7,
        hours: 30
    },
    {
        id: 10,
        name: "Unsupervised Learning",
        moduleId: 7,
        hours: 25
    },
    {
        id: 11,
        name: "Neural Networks",
        moduleId: 8,
        hours: 30
    },
    {
        id: 12,
        name: "NLP Basics",
        moduleId: 9,
        hours: 25
    }
];

// Fonction pour obtenir les étudiants d'un groupe
export const getGroupStudents = (groupId: number): Student[] => {
    return mockStudents.filter(student => student.groupId === groupId);
};

// Groupes
export const mockGroups: Group[] = [
    {
        id: 1,
        name: "GL-1A",
        fieldId: 1,
        students: getGroupStudents(1)
    },
    {
        id: 2,
        name: "GL-1B",
        fieldId: 1,
        students: getGroupStudents(2)
    },
    {
        id: 3,
        name: "RT-1A",
        fieldId: 2,
        students: getGroupStudents(3)
    },
    {
        id: 4,
        name: "RT-1B",
        fieldId: 2,
        students: getGroupStudents(4)
    },
    {
        id: 5,
        name: "IA-1A",
        fieldId: 3,
        students: getGroupStudents(5)
    },
    {
        id: 6,
        name: "IA-1B",
        fieldId: 3,
        students: getGroupStudents(6)
    }
];

// Professeurs
export const mockProfessors: Professor[] = [
    {
        id: 1,
        name: "Dr. Ahmed Benali",
        email: "ahmed.benali@univ.ma",
        modules: [1, 2],
        subModules: [1, 3]
    },
    {
        id: 2,
        name: "Dr. Fatima Alami",
        email: "fatima.alami@univ.ma",
        modules: [1],
        subModules: [2]
    },
    {
        id: 3,
        name: "Dr. Karim Idrissi",
        email: "karim.idrissi@univ.ma",
        modules: [3],
        subModules: [4]
    },
    {
        id: 4,
        name: "Dr. Samira Hassani",
        email: "samira.hassani@univ.ma",
        modules: [4, 5],
        subModules: [5, 6]
    },
    {
        id: 5,
        name: "Dr. Youssef El Fassi",
        email: "youssef.elfassi@univ.ma",
        modules: [5, 6],
        subModules: [7, 8]
    },
    {
        id: 6,
        name: "Dr. Leila Benjelloun",
        email: "leila.benjelloun@univ.ma",
        modules: [7, 8],
        subModules: [9, 10, 11]
    },
    {
        id: 7,
        name: "Dr. Mehdi Alami",
        email: "mehdi.alami@univ.ma",
        modules: [8, 9],
        subModules: [11, 12]
    }
]; 