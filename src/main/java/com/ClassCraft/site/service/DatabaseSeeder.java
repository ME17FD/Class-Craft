package com.ClassCraft.site.service;


import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ClassCraft.site.models.Admin;
import com.ClassCraft.site.models.Classroom;
import com.ClassCraft.site.models.Filiere;
import com.ClassCraft.site.models.Group;
import com.ClassCraft.site.models.Module;
import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.models.Reservation;
import com.ClassCraft.site.models.Sceance;
import com.ClassCraft.site.models.Session;
import com.ClassCraft.site.models.Student;
import com.ClassCraft.site.models.SubModule;
import com.ClassCraft.site.repository.AdminRepository;
import com.ClassCraft.site.repository.ClassroomRepository;
import com.ClassCraft.site.repository.FiliereRepository;
import com.ClassCraft.site.repository.GroupRepository;
import com.ClassCraft.site.repository.ModuleRepository;
import com.ClassCraft.site.repository.ProfessorRepository;
import com.ClassCraft.site.repository.ReservationRepository;
import com.ClassCraft.site.repository.SeanceRepository;
import com.ClassCraft.site.repository.SessionRepository;
import com.ClassCraft.site.repository.StudentRepository;
import com.ClassCraft.site.repository.SubModuleRepository;


@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final SessionRepository sessionRepository;
    private final FiliereRepository filiereRepository;
    private final GroupRepository groupRepository;
    private final ClassroomRepository classroomRepository;
    private final ModuleRepository moduleRepository;
    private final SubModuleRepository subModuleRepository;
    private final SeanceRepository seanceRepository;
    private final ReservationRepository reservationRepository;
    
    // Use concrete repositories instead of UserRepository
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    public DatabaseSeeder(SessionRepository sessionRepository,
                        FiliereRepository filiereRepository,
                        GroupRepository groupRepository,
                        ClassroomRepository classroomRepository,
                        ModuleRepository moduleRepository,
                        SubModuleRepository subModuleRepository,
                        SeanceRepository seanceRepository,
                        ReservationRepository reservationRepository,
                        StudentRepository studentRepository,
                        ProfessorRepository professorRepository,
                        AdminRepository adminRepository,
                        PasswordEncoder passwordEncoder) {
        this.sessionRepository = sessionRepository;
        this.filiereRepository = filiereRepository;
        this.groupRepository = groupRepository;
        this.classroomRepository = classroomRepository;
        this.moduleRepository = moduleRepository;
        this.subModuleRepository = subModuleRepository;
        this.seanceRepository = seanceRepository;
        this.reservationRepository = reservationRepository;
        this.studentRepository = studentRepository;
        this.professorRepository = professorRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (isDatabaseSeeded()) {
            System.out.println("Database already seeded. Skipping seeding process.");
            return;
        }

        System.out.println("Seeding database...");
        
        List<Session> sessions = createSessions();
        List<Filiere> filieres = createFilieres(sessions);
        List<Group> groups = createGroups(filieres);
        List<Classroom> classrooms = createClassrooms();
        List<Professor> professors = createProfessors();
        List<Student> students = createStudents(groups);
        List<Admin> admins = createAdmins();
        List<Module> modules = createModules(filieres, professors);
        List<SubModule> subModules = createSubModules(modules, professors);
        List<Sceance> sceances = createSceances(subModules, groups, classrooms, professors);
        List<Reservation> reservations = createReservations(sceances);

        // Save all entities using their specific repositories
        sessionRepository.saveAll(sessions);
        filiereRepository.saveAll(filieres);
        groupRepository.saveAll(groups);
        classroomRepository.saveAll(classrooms);
        professorRepository.saveAll(professors);
        studentRepository.saveAll(students);
        adminRepository.saveAll(admins);
        moduleRepository.saveAll(modules);
        subModuleRepository.saveAll(subModules);
        seanceRepository.saveAll(sceances);
        reservationRepository.saveAll(reservations);

        System.out.println("Database seeding completed successfully!");
    }

    private boolean isDatabaseSeeded() {
        // Check using admin repository instead of userRepository
        return adminRepository.count() > 1;
    }

    private List<Session> createSessions() {
        List<Session> sessions = new ArrayList<>();

        Session session1 = new Session();
        session1.setName("2023-2024");
        session1.setStartDate(new Date(123, 8, 1)); // September 1, 2023
        session1.setEndDate(new Date(124, 5, 30)); // June 30, 2024

        Session session2 = new Session();
        session2.setName("2024-2025");
        session2.setStartDate(new Date(124, 8, 1)); // September 1, 2024
        session2.setEndDate(new Date(125, 5, 30)); // June 30, 2025

        sessions.addAll(Arrays.asList(session1, session2));
        return sessions;
    }

    private List<Filiere> createFilieres(List<Session> sessions) {
        List<Filiere> filieres = new ArrayList<>();
        String[] filiereNames = {
            "Computer Science",
            "Electrical Engineering",
            "Mechanical Engineering",
            "Business Administration",
            "Mathematics",
            "Physics"
        };

        String[] descriptions = {
            "Study of computation, information, and automation",
            "Study of electricity, electronics, and electromagnetism",
            "Study of mechanical systems and thermal devices",
            "Study of business organization and management",
            "Study of numbers, quantities, and shapes",
            "Study of matter, energy, and their interactions"
        };

        for (int i = 0; i < filiereNames.length; i++) {
            Filiere filiere = new Filiere();
            filiere.setName(filiereNames[i]);
            filiere.setDescription(descriptions[i]);
            filiere.setSession(sessions.get(i % sessions.size()));
            filieres.add(filiere);
        }
        return filieres;
    }

    private List<Group> createGroups(List<Filiere> filieres) {
        List<Group> groups = new ArrayList<>();
        String[] groupNames = {"G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"};

        for (String groupName : groupNames) {
            Group group = new Group();
            group.setName(groupName);
            group.setFiliere(filieres.get(random.nextInt(filieres.size())));
            groups.add(group);
        }
        return groups;
    }

    private List<Classroom> createClassrooms() {
        List<Classroom> classrooms = new ArrayList<>();
        Classroom.ClassroomType[] types = Classroom.ClassroomType.values();
        String[] roomNames = {"A101", "A102", "B201", "B202", "C301", "C302", "D401", "D402"};

        for (int i = 0; i < roomNames.length; i++) {
            Classroom classroom = new Classroom();
            classroom.setName(roomNames[i]);
            classroom.setCapacity(30 + (i * 10)); // Varying capacities
            classroom.setType(types[i % types.length]);
            classrooms.add(classroom);
        }
        return classrooms;
    }

    private List<Professor> createProfessors() {
        List<Professor> professors = new ArrayList<>();
        String[] firstNames = {"Mohamed", "Fatima", "Ahmed", "Amina", "Youssef", "Hafsa", "Karim", "Leila"};
        String[] lastNames = {"Alaoui", "Benjelloun", "Cherkaoui", "El Fassi", "Idrissi", "Mansouri", "Rahmani", "Saidi"};
        String[] specialties = {
            "Computer Science", "Mathematics", "Physics", "Electrical Engineering",
            "Mechanical Engineering", "Business", "Chemistry", "Biology"
        };
        String[] grades = {"Professor", "Associate Professor", "Assistant Professor", "Lecturer"};

        for (int i = 0; i < 10; i++) {
            Professor professor = new Professor();
            professor.setFirstName(firstNames[i % firstNames.length]);
            professor.setLastName(lastNames[i % lastNames.length]);
            professor.setEmail(professor.getFirstName().toLowerCase() + "." + professor.getLastName().toLowerCase() + "@classcraft.com");
            professor.setPassword(passwordEncoder.encode("prof" + (i + 1)));
            professor.setApproved(true);
            professor.setSpecialty(specialties[i % specialties.length]);
            professor.setGrade(grades[i % grades.length]);
            professors.add(professor);
        }
        return professors;
    }

    private List<Student> createStudents(List<Group> groups) {
        List<Student> students = new ArrayList<>();
        String[] firstNames = {
            "Yassine", "Sara", "Mehdi", "Nadia", "Omar", "Lina", "Adil", "Hanae",
            "Karim", "Fatima", "Amine", "Layla", "Rachid", "Samira", "Hassan", "Amina",
            "Bilal", "Yasmine", "Tarek", "Nour", "Zakaria", "Salma", "Reda", "Imane",
            "Anas", "Ghita", "Younes", "Houda", "Hamza", "Meriem", "Ayoub", "Soukaina"
        };
        String[] lastNames = {
            "Bennani", "Chraibi", "Daoudi", "El Khatib", "Fahmi", "Ghazi", "Haddad", "Ibrahim",
            "Alaoui", "Benjelloun", "Cherkaoui", "El Fassi", "Idrissi", "Mansouri", "Rahmani", "Saidi",
            "Bouazza", "El Malki", "Hakimi", "Kabbaj", "Lahlou", "Mouline", "Naciri", "Ouali",
            "Rami", "Slimani", "Tazi", "Zeroual", "Benali", "El Ouazzani", "Hassani", "Khalil"
        };

        for (int i = 0; i < 100; i++) {
            Student student = new Student();
            // Use a different combination of names for each student
            int firstNameIndex = (i + random.nextInt(32)) % firstNames.length;
            int lastNameIndex = (i + random.nextInt(32)) % lastNames.length;
            
            student.setFirstName(firstNames[firstNameIndex]);
            student.setLastName(lastNames[lastNameIndex]);
            student.setEmail("student" + (i + 1) + "@classcraft.com");
            student.setPassword(passwordEncoder.encode("student"+ (i + 1)));
            student.setApproved(true);
            student.setCNE("C" + String.format("%05d", i + 1));
            student.setRegistrationNumber("R" + String.format("%05d", i + 1));
            student.setGroup(groups.get(i % groups.size()));
            students.add(student);
        }
        return students;
    }

    private List<Admin> createAdmins() {
        List<Admin> admins = new ArrayList<>();

        Admin admin1 = new Admin();
        admin1.setFirstName("Admin");
        admin1.setLastName("System");
        admin1.setEmail("sadmin@classcraft.com");
        admin1.setPassword(passwordEncoder.encode("admin123"));
        admin1.setApproved(true);
        admin1.setRole("SUPER_ADMIN");

        Admin admin2 = new Admin();
        admin2.setFirstName("Manager");
        admin2.setLastName("Department");
        admin2.setEmail("manager@classcraft.com");
        admin2.setPassword(passwordEncoder.encode("manager123"));
        admin2.setApproved(true);
        admin2.setRole("DEPARTMENT_ADMIN");

        admins.addAll(Arrays.asList(admin1, admin2));
        return admins;
    }

    private List<Module> createModules(List<Filiere> filieres, List<Professor> professors) {
        List<Module> modules = new ArrayList<>();
        String[] moduleNames = {
            "Algorithms", "Database Systems", "Operating Systems",
            "Computer Networks", "Software Engineering", "Artificial Intelligence",
            "Machine Learning", "Data Structures", "Computer Architecture",
            "Web Development", "Mobile Development", "Cyber Security"
        };

        String[] codes = {"CS101", "CS102", "CS201", "CS202", "CS301", "CS302", "CS401", "CS402", "EE101", "EE201", "ME101", "BA101"};

        for (int i = 0; i < moduleNames.length; i++) {
            Module module = new Module();
            module.setName(moduleNames[i]);
            module.setCode(codes[i]);
            module.setFiliere(filieres.get(i % filieres.size()));
            module.setProfessorInCharge(professors.get(i % professors.size()));
            modules.add(module);
        }
        return modules;
    }

    private List<SubModule> createSubModules(List<Module> modules, List<Professor> professors) {
        List<SubModule> subModules = new ArrayList<>();
        String[][] subModuleNames = {
            {"Algorithm Design", "Algorithm Analysis"},
            {"Relational Databases", "NoSQL Databases"},
            {"Process Management", "Memory Management"},
            {"Network Protocols", "Network Security"},
            {"Requirements Engineering", "Software Testing"},
            {"Search Algorithms", "Knowledge Representation"},
            {"Supervised Learning", "Unsupervised Learning"},
            {"Linked Lists", "Trees and Graphs"},
            {"CPU Design", "Memory Hierarchy"},
            {"Frontend Development", "Backend Development"},
            {"Android Development", "iOS Development"},
            {"Cryptography", "Ethical Hacking"}
        };

        Integer[] hours = {20, 30, 15, 25, 20, 30, 25, 20, 15, 30, 25, 20};

        for (int i = 0; i < modules.size(); i++) {
            for (int j = 0; j < subModuleNames[i].length; j++) {
                SubModule subModule = new SubModule();
                subModule.setName(subModuleNames[i][j]);
                subModule.setNbrHours(hours[i % hours.length] / subModuleNames[i].length);
                subModule.setModule(modules.get(i));
                subModule.setTeacher(professors.get((i + j) % professors.size()));
                subModules.add(subModule);
            }
        }
        return subModules;
    }

    private List<Sceance> createSceances(List<SubModule> subModules, List<Group> groups, 
                                       List<Classroom> classrooms, List<Professor> professors) {
        List<Sceance> sceances = new ArrayList<>();
        String[] daysOfWeek = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"};
        Sceance.SceanceType[] types = Sceance.SceanceType.values();

        for (SubModule subModule : subModules) {
            for (int i = 0; i < 2; i++) { // Create 2 sceances per submodule
                Sceance sceance = new Sceance();
                sceance.setDayOfWeek(daysOfWeek[random.nextInt(daysOfWeek.length)]);
                sceance.setStartTime(new Time(8 + random.nextInt(8), 0, 0)); // Between 8:00 and 15:00
                sceance.setEndTime(new Time(sceance.getStartTime().getHours() + 2, 0, 0)); // 2-hour duration
                sceance.setFrequency(1 + random.nextInt(3)); // Every 1-3 weeks
                sceance.setType(types[random.nextInt(types.length)]);
                sceance.setWasAttended(random.nextBoolean());
                sceance.setSubModule(subModule);
                sceance.setModule(subModule.getModule());
                
                // Assign to a random group from the module's filiere
                Filiere filiere = subModule.getModule().getFiliere();
                List<Group> filiereGroups = groups.stream()
                    .filter(g -> g.getFiliere().equals(filiere))
                    .toList();
                if (!filiereGroups.isEmpty()) {
                    sceance.setGroup(filiereGroups.get(random.nextInt(filiereGroups.size())));
                }
                
                sceance.setClassroom(classrooms.get(random.nextInt(classrooms.size())));
                sceance.setProfessor(professors.get(random.nextInt(professors.size())));
                
                sceances.add(sceance);
            }
        }
        return sceances;
    }

    private List<Reservation> createReservations(List<Sceance> sceances) {
    List<Reservation> reservations = new ArrayList<>();

    // Define the possible time slots
    String[][] timeSlots = {
        {"08:00", "10:00"},
        {"10:15", "12:15"},
        {"13:00", "15:00"},
        {"15:15", "17:15"}
    };
        Reservation.ReservationType[] types = Reservation.ReservationType.values();

    for (Sceance sceance : sceances) {
        if (random.nextDouble() < 0.7) { // 70% chance to create a reservation
            Reservation reservation = new Reservation();

            // Randomly choose a day within the next 30 days
            LocalDate date = LocalDate.now().plusDays(random.nextInt(30));

            // Pick a random time slot
            String[] slot = timeSlots[random.nextInt(timeSlots.length)];
            LocalTime startTime = LocalTime.parse(slot[0]);
            LocalTime endTime = LocalTime.parse(slot[1]);

            // Combine date and time to get LocalDateTime
            reservation.setStartDateTime(LocalDateTime.of(date, startTime));
            reservation.setEndDateTime(LocalDateTime.of(date, endTime));

            reservation.setWasAttended(random.nextBoolean());
            reservation.setSubModule(sceance.getSubModule());
            reservation.setGroup(sceance.getGroup());
            reservation.setClassroom(sceance.getClassroom());
            reservation.setType(types[random.nextInt(types.length)]);

            reservations.add(reservation);
        }
    }

    return reservations;
}

}