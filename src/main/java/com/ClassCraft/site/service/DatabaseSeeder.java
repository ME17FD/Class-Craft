package com.ClassCraft.site.service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ClassCraft.site.models.*;
import com.ClassCraft.site.models.Module;
import com.ClassCraft.site.repository.*;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ClassroomRepository classroomRepository;
    private final FiliereRepository filiereRepository;
    private final GroupRepository groupRepository;
    private final AcademicModuleRepository moduleRepository;
    private final ProfessorRepository professorRepository;
    private final SessionRepository sessionRepository;
    private final SubModuleRepository subModuleRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();

    public DatabaseSeeder(ClassroomRepository classroomRepository,
                        FiliereRepository filiereRepository,
                        GroupRepository groupRepository,
                        AcademicModuleRepository moduleRepository,
                        ProfessorRepository professorRepository,
                        SessionRepository sessionRepository,
                        SubModuleRepository subModuleRepository,
                        StudentRepository studentRepository,
                        PasswordEncoder passwordEncoder) {
        this.classroomRepository = classroomRepository;
        this.filiereRepository = filiereRepository;
        this.groupRepository = groupRepository;
        this.moduleRepository = moduleRepository;
        this.professorRepository = professorRepository;
        this.sessionRepository = sessionRepository;
        this.subModuleRepository = subModuleRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        boolean isDatabaseEmpty = classroomRepository.count() == 0 &&
                               filiereRepository.count() == 0 &&
                               groupRepository.count() == 0 &&
                               moduleRepository.count() == 0 &&
                               professorRepository.count() == 0 &&
                               sessionRepository.count() == 0 &&
                               subModuleRepository.count() == 0 &&
                               studentRepository.count() == 0;

    if (!isDatabaseEmpty) {
        System.out.println("Database already contains data. Seeding skipped.");
        return;
    }
        // --- Create Sessions ---
        List<Session> sessions = createSessions();
        Session currentSession = sessions.get(0); // Use 2024/2025 as current session

        // --- Create Classrooms ---
        List<Classroom> classrooms = createClassrooms();

        // --- Create Filieres ---
        List<Filiere> filieres = createFilieres(currentSession);
        Filiere csFiliere = filieres.get(0);
        Filiere elecFiliere = filieres.get(1);
        Filiere mechFiliere = filieres.get(2);
        Filiere mathFiliere = filieres.get(3);

        // --- Create Groups ---
        List<Group> groups = createGroups(filieres);
        Group groupCS1 = groups.get(0);
        Group groupCS2 = groups.get(1);
        Group groupElec1 = groups.get(2);
        Group groupMech1 = groups.get(3);
        Group groupMath1 = groups.get(4);

        // --- Create Professors ---
        List<Professor> professors = createProfessors();
        Professor professorJohn = professors.get(0);
        Professor professorSmith = professors.get(1);
        Professor professorLee = professors.get(2);
        Professor professorGarcia = professors.get(3);
        Professor professorChen = professors.get(4);

        // --- Create Modules ---
        List<Module> modules = createModules(filieres, professors);
        Module javaModule = modules.get(0);
        Module dbModule = modules.get(1);
        Module webModule = modules.get(2);
        Module algoModule = modules.get(3);
        Module circuitModule = modules.get(4);

        // --- Create SubModules ---
        List<SubModule> subModules = createSubModules(modules, professors);

        // --- Create Students ---
        List<Student> students = createStudents(groups);

        System.out.println("Database has been seeded successfully with:");
        System.out.println("- " + sessions.size() + " sessions");
        System.out.println("- " + classrooms.size() + " classrooms");
        System.out.println("- " + filieres.size() + " filieres");
        System.out.println("- " + groups.size() + " groups");
        System.out.println("- " + professors.size() + " professors");
        System.out.println("- " + modules.size() + " modules");
        System.out.println("- " + subModules.size() + " sub-modules");
        System.out.println("- " + students.size() + " students");
    }

    private List<Session> createSessions() {
        List<Session> sessions = new ArrayList<>();
        
        if (!sessionRepository.existsByName("2024/2025")) {
            Session session1 = new Session();
            session1.setName("2024/2025");
            session1.setStartDate(Date.valueOf(LocalDate.of(2024, 9, 1)));
            session1.setEndDate(Date.valueOf(LocalDate.of(2025, 7, 1)));
            sessionRepository.save(session1);
            sessions.add(session1);
        } else {
            sessions.add(sessionRepository.findByName("2024/2025"));
        }

        if (!sessionRepository.existsByName("2023/2024")) {
            Session session2 = new Session();
            session2.setName("2023/2024");
            session2.setStartDate(Date.valueOf(LocalDate.of(2023, 9, 1)));
            session2.setEndDate(Date.valueOf(LocalDate.of(2024, 7, 1)));
            sessionRepository.save(session2);
            sessions.add(session2);
        }

        if (!sessionRepository.existsByName("2025/2026")) {
            Session session3 = new Session();
            session3.setName("2025/2026");
            session3.setStartDate(Date.valueOf(LocalDate.of(2025, 9, 1)));
            session3.setEndDate(Date.valueOf(LocalDate.of(2026, 7, 1)));
            sessionRepository.save(session3);
            sessions.add(session3);
        }

        return sessions;
    }

    private List<Classroom> createClassrooms() {
        List<Classroom> classrooms = new ArrayList<>();
        
        // Amphitheatres
        String[] amphitheatreNames = {"Amphitheatre A", "Amphitheatre B", "Amphitheatre C", "Amphitheatre D"};
        for (String name : amphitheatreNames) {
            if (!classroomRepository.existsByName(name)) {
                Classroom amphitheatre = new Classroom();
                amphitheatre.setName(name);
                amphitheatre.setCapacity(200 + random.nextInt(200)); // 200-400 capacity
                classroomRepository.save(amphitheatre);
                classrooms.add(amphitheatre);
            }
        }

        // Salles
        for (int i = 1; i <= 20; i++) {
            String name = "Salle " + (100 + i);
            if (!classroomRepository.existsByName(name)) {
                Classroom salle = new Classroom();
                salle.setName(name);
                salle.setCapacity(20 + random.nextInt(30)); // 20-50 capacity
                salle.setType(Classroom.ClassroomType.SALLE_TD); // ← Nouveau champ "type"
                classroomRepository.save(salle);
                classrooms.add(salle);
            }
        }

        

        return classrooms;
    }

    private List<Filiere> createFilieres(Session currentSession) {
        List<Filiere> filieres = new ArrayList<>();
        
        String[][] filiereData = {
            {"Computer Science", "Bachelor's degree in Computer Science"},
            {"Electronics", "Bachelor's degree in Electronics"},
            {"Mechanical Engineering", "Bachelor's degree in Mechanical Engineering"},
            {"Mathematics", "Bachelor's degree in Mathematics"},
            {"Physics", "Bachelor's degree in Physics"},
            {"Business Administration", "Bachelor's degree in Business Administration"}
        };

        for (String[] data : filiereData) {
            if (filiereRepository.findByName(data[0]) == null) {
                Filiere filiere = new Filiere();
                filiere.setName(data[0]);
                filiere.setDescription(data[1]);
                filiere.setSession(currentSession);
                filiereRepository.save(filiere);
                filieres.add(filiere);
            }
        }

        return filieres;
    }

    private List<Group> createGroups(List<Filiere> filieres) {
        List<Group> groups = new ArrayList<>();
        
        // For each filiere, create 2-3 groups
        for (Filiere filiere : filieres) {
            int groupCount = 2 + random.nextInt(2); // 2-3 groups per filiere
            
            for (int i = 1; i <= groupCount; i++) {
                String groupName = "Group " + filiere.getName().substring(0, 3) + i;
                
                    Group group = new Group();
                    group.setName(groupName);
                    group.setFiliere(filiere);
                    groupRepository.save(group);
                    groups.add(group);
                
            }
        }

        return groups;
    }

    private List<Professor> createProfessors() {
        List<Professor> professors = new ArrayList<>();
        
        String[][] professorData = {
            {"John", "Doe", "john.doe@example.com", "Software Engineering", "Associate Professor"},
            {"Jane", "Smith", "jane.smith@example.com", "Database Systems", "Professor"},
            {"Robert", "Lee", "robert.lee@example.com", "Artificial Intelligence", "Assistant Professor"},
            {"Maria", "Garcia", "maria.garcia@example.com", "Computer Networks", "Professor"},
            {"Wei", "Chen", "wei.chen@example.com", "Data Science", "Associate Professor"},
            {"David", "Wilson", "david.wilson@example.com", "Electronics", "Professor"},
            {"Sarah", "Johnson", "sarah.johnson@example.com", "Mathematics", "Assistant Professor"},
            {"Michael", "Brown", "michael.brown@example.com", "Physics", "Professor"}
        };

        for (String[] data : professorData) {
            if (professorRepository.findByEmail(data[2]).isEmpty()) {
                Professor professor = new Professor();
                professor.setFirstName(data[0]);
                professor.setLastName(data[1]);
                professor.setEmail(data[2]);
                professor.setPassword(passwordEncoder.encode("professor123"));
                professor.setSpecialty(data[3]);
                professor.setGrade(data[4]);
                professorRepository.save(professor);
                professors.add(professor);
            }
        }

        return professors;
    }

    private List<Module> createModules(List<Filiere> filieres, List<Professor> professors) {
        List<Module> modules = new ArrayList<>();
        
        String[][] moduleData = {
            // Computer Science modules
            {"Java Programming", "CS101", "Computer Science", "0"},
            {"Database Systems", "CS102", "Computer Science", "1"},
            {"Web Development", "CS103", "Computer Science", "2"},
            {"Algorithms", "CS104", "Computer Science", "3"},
            {"Operating Systems", "CS105", "Computer Science", "4"},
            
            // Electronics modules
            {"Circuit Theory", "EL101", "Electronics", "5"},
            {"Digital Electronics", "EL102", "Electronics", "6"},
            {"Signal Processing", "EL103", "Electronics", "0"},
            
            // Mechanical Engineering modules
            {"Thermodynamics", "ME101", "Mechanical Engineering", "1"},
            {"Fluid Mechanics", "ME102", "Mechanical Engineering", "2"},
            
            // Mathematics modules
            {"Linear Algebra", "MA101", "Mathematics", "3"},
            {"Calculus", "MA102", "Mathematics", "4"}
        };

        for (String[] data : moduleData) {
            if (moduleRepository.findByCode(data[1]) == null) {
                Module module = new Module();
                module.setName(data[0]);
                module.setCode(data[1]);
                
                // Find the filiere
                Filiere filiere = filieres.stream()
                    .filter(f -> f.getName().equals(data[2]))
                    .findFirst()
                    .orElse(null);
                
                module.setFiliere(filiere);
                
                // Assign a professor (using modulo to prevent index out of bounds)
                int profIndex = Integer.parseInt(data[3]) % professors.size();
                module.setProfessorInCharge(professors.get(profIndex));
                
                moduleRepository.save(module);
                modules.add(module);
            }
        }

        return modules;
    }

    private List<SubModule> createSubModules(List<Module> modules, List<Professor> professors) {
        List<SubModule> subModules = new ArrayList<>();
        
        String[][] subModuleData = {
            {"Introduction to Java", "20", "CS101"},
            {"Object-Oriented Programming", "30", "CS101"},
            {"Java Collections", "15", "CS101"},
            {"Relational Databases", "25", "CS102"},
            {"SQL Programming", "20", "CS102"},
            {"Database Design", "15", "CS102"},
            {"HTML/CSS", "15", "CS103"},
            {"JavaScript", "25", "CS103"},
            {"Frontend Frameworks", "20", "CS103"},
            {"Sorting Algorithms", "15", "CS104"},
            {"Graph Algorithms", "20", "CS104"},
            {"Process Management", "20", "CS105"},
            {"Memory Management", "15", "CS105"},
            {"Basic Circuit Elements", "20", "EL101"},
            {"Network Theorems", "25", "EL101"}
        };

        for (String[] data : subModuleData) {
            if (subModuleRepository.findByName(data[0]) == null) {
                SubModule subModule = new SubModule();
                subModule.setName(data[0]);
                subModule.setNbrHours(Integer.parseInt(data[1]));
                
                // Find the module
                Module module = modules.stream()
                    .filter(m -> m.getCode().equals(data[2]))
                    .findFirst()
                    .orElse(null);
                
                subModule.setModule(module);
                
                // Assign a random professor (could be same as module in charge or different)
                subModule.setTeacher(professors.get(random.nextInt(professors.size())));
                
                subModuleRepository.save(subModule);
                subModules.add(subModule);
            }
        }

        return subModules;
    }

    private List<Student> createStudents(List<Group> groups) {
        List<Student> students = new ArrayList<>();
        
        String[][] studentData = {
            {"Alice", "Smith", "alice.smith@example.com", "CNE001", "REG001"},
            {"Bob", "Johnson", "bob.johnson@example.com", "CNE002", "REG002"},
            {"Charlie", "Brown", "charlie.brown@example.com", "CNE003", "REG003"},
            {"David", "Wilson", "david.wilson@example.com", "CNE004", "REG004"},
            {"Eve", "Davis", "eve.davis@example.com", "CNE005", "REG005"},
            {"Frank", "Miller", "frank.miller@example.com", "CNE006", "REG006"},
            {"Grace", "Lee", "grace.lee@example.com", "CNE007", "REG007"},
            {"Henry", "Garcia", "henry.garcia@example.com", "CNE008", "REG008"},
            {"Ivy", "Martinez", "ivy.martinez@example.com", "CNE009", "REG009"},
            {"Jack", "Taylor", "jack.taylor@example.com", "CNE010", "REG010"},
            {"Karen", "Anderson", "karen.anderson@example.com", "CNE011", "REG011"},
            {"Liam", "Thomas", "liam.thomas@example.com", "CNE012", "REG012"},
            {"Mia", "Jackson", "mia.jackson@example.com", "CNE013", "REG013"},
            {"Noah", "White", "noah.white@example.com", "CNE014", "REG014"},
            {"Olivia", "Harris", "olivia.harris@example.com", "CNE015", "REG015"},
            {"Peter", "Martin", "peter.martin@example.com", "CNE016", "REG016"},
            {"Quinn", "Thompson", "quinn.thompson@example.com", "CNE017", "REG017"},
            {"Rachel", "Moore", "rachel.moore@example.com", "CNE018", "REG018"},
            {"Steve", "Clark", "steve.clark@example.com", "CNE019", "REG019"},
            {"Tina", "Rodriguez", "tina.rodriguez@example.com", "CNE020", "REG020"}
        };

        for (String[] data : studentData) {
            if (studentRepository.findByEmail(data[2]).isEmpty()) {
                Student student = new Student();
                student.setFirstName(data[0]);
                student.setLastName(data[1]);
                student.setEmail(data[2]);
                student.setPassword(passwordEncoder.encode("student123"));
                student.setCNE(data[3]);
                student.setRegistrationNumber(data[4]);
                
                // Assign to a random group
                student.setGroup(groups.get(random.nextInt(groups.size())));
                
                student.setApproved(true);
                studentRepository.save(student);
                students.add(student);
            }
        }

        return students;
    }
}