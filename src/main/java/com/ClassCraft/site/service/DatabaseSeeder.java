package com.ClassCraft.site.service;

import java.sql.Date;
import java.time.LocalDate;

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
        // --- Create Session ---
        if (!sessionRepository.existsByName("2024/2025")) {
            Session session = new Session();
            session.setName("2024/2025");
            session.setStartDate(Date.valueOf(LocalDate.of(2024, 9, 1)));
            session.setEndDate(Date.valueOf(LocalDate.of(2025, 7, 1)));
            sessionRepository.save(session);
        }
        Session currentSession = sessionRepository.findByName("2024/2025");

        // --- Create Amphitheatres ---
        if (!classroomRepository.existsByName("Amphitheatre A")) {
            Amphitheatre amphitheatre1 = new Amphitheatre();
            amphitheatre1.setName("Amphitheatre A");
            amphitheatre1.setCapacity(300);
            amphitheatre1.setHasMicrophone(true);
            classroomRepository.save(amphitheatre1);
        }
        if (!classroomRepository.existsByName("Amphitheatre B")) {
            Amphitheatre amphitheatre2 = new Amphitheatre();
            amphitheatre2.setName("Amphitheatre B");
            amphitheatre2.setCapacity(200);
            amphitheatre2.setHasMicrophone(false);
            classroomRepository.save(amphitheatre2);
        }

        // --- Create Salles ---
        if (!classroomRepository.existsByName("Salle 101")) {
            Salle salle1 = new Salle();
            salle1.setName("Salle 101");
            salle1.setCapacity(40);
            salle1.setHasProjector(true);
            classroomRepository.save(salle1);
        }
        if (!classroomRepository.existsByName("Salle 102")) {
            Salle salle2 = new Salle();
            salle2.setName("Salle 102");
            salle2.setCapacity(30);
            salle2.setHasProjector(false);
            classroomRepository.save(salle2);
        }

        // --- Create Filieres ---
        if (filiereRepository.findByName("Computer Science") == null) {
            Filiere cs = new Filiere();
            cs.setName("Computer Science");
            cs.setDescription("Bachelor's degree in Computer Science");
            cs.setSession(currentSession);
            filiereRepository.save(cs);
        }
        if (filiereRepository.findByName("Electronics") == null) {
            Filiere elec = new Filiere();
            elec.setName("Electronics");
            elec.setDescription("Bachelor's degree in Electronics");
            elec.setSession(currentSession);
            filiereRepository.save(elec);
        }
        Filiere csFiliere = filiereRepository.findByName("Computer Science");
        Filiere elecFiliere = filiereRepository.findByName("Electronics");

        // --- Create Groups ---
        if (groupRepository.findByName("Group CS1") == null) {
            Group groupCS1 = new Group();
            groupCS1.setName("Group CS1");
            groupCS1.setFiliere(csFiliere);
            groupRepository.save(groupCS1);
        }
        if (groupRepository.findByName("Group Electronics1") == null) {
            Group groupElec1 = new Group();
            groupElec1.setName("Group Electronics1");
            groupElec1.setFiliere(elecFiliere);
            groupRepository.save(groupElec1);
        }
        Group groupCS1 = groupRepository.findByName("Group CS1");

        // --- Create Professors ---
        if (professorRepository.findByEmail("john.doe@example.com").isEmpty()) {
            Professor prof1 = new Professor();
            prof1.setFirstName("John");
            prof1.setLastName("Doe");
            prof1.setEmail("john.doe@example.com");
            prof1.setPassword(passwordEncoder.encode("password"));
            prof1.setSpecialty("Software Engineering");
            prof1.setGrade("Associate Professor");
            professorRepository.save(prof1);
        }
        Professor professorJohn = professorRepository.findByEmail("john.doe@example.com").orElse(null);

        // --- Create Modules ---
        if (moduleRepository.findByCode("CS101") == null) {
            Module javaModule = new Module();
            javaModule.setName("Java Programming");
            javaModule.setCode("CS101");
            javaModule.setFiliere(csFiliere);
            javaModule.setProfessorInCharge(professorJohn);
            moduleRepository.save(javaModule);
        }
        Module javaModule = moduleRepository.findByCode("CS101");

        // --- Create SubModules ---
        if (subModuleRepository.findByName("Introduction to Java") == null) {
            SubModule introJava = new SubModule();
            introJava.setName("Introduction to Java");
            introJava.setNbrHours(20);
            introJava.setModule(javaModule);
            introJava.setTeacher(professorJohn);
            subModuleRepository.save(introJava);
        }
        if (subModuleRepository.findByName("Advanced Java Topics") == null) {
            SubModule advancedJava = new SubModule();
            advancedJava.setName("Advanced Java Topics");
            advancedJava.setNbrHours(30);
            advancedJava.setModule(javaModule);
            advancedJava.setTeacher(professorJohn);
            subModuleRepository.save(advancedJava);
        }

        // --- Create Students ---
        if (studentRepository.findByEmail("student1@example.com").isEmpty()) {
            Student student1 = new Student();
            student1.setFirstName("Alice");
            student1.setLastName("Smith");
            student1.setEmail("student1@example.com");
            student1.setPassword(passwordEncoder.encode("password"));
            student1.setCNE("CNE001");
            student1.setRegistrationNumber("REG001");
            student1.setGroup(groupCS1);
            student1.setApproved(true);
            studentRepository.save(student1);
        }
        if (studentRepository.findByEmail("student2@example.com").isEmpty()) {
            Student student2 = new Student();
            student2.setFirstName("Bob");
            student2.setLastName("Johnson");
            student2.setEmail("student2@example.com");
            student2.setPassword(passwordEncoder.encode("password"));
            student2.setCNE("CNE002");
            student2.setRegistrationNumber("REG002");
            student2.setGroup(groupCS1);
            student2.setApproved(true);
            studentRepository.save(student2);
        }

        System.out.println("Database has been seeded successfully!");
    }
}
