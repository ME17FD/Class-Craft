package com.ClassCraft.site.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ClassCraft.site.dto.ClassroomDTO;
import com.ClassCraft.site.dto.GroupDTO;
import com.ClassCraft.site.dto.ModuleDTO;
import com.ClassCraft.site.dto.ProfessorDTO;
import com.ClassCraft.site.dto.SeanceDTO;
import com.ClassCraft.site.dto.SubModuleDTO;
import com.ClassCraft.site.models.Classroom;
import com.ClassCraft.site.models.Group;
import com.ClassCraft.site.models.Module;
import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.models.Sceance;
import com.ClassCraft.site.models.SubModule;
import com.ClassCraft.site.repository.ClassroomRepository;
import com.ClassCraft.site.repository.SeanceRepository;

@Service
public class SeanceServiceImpl {
    @Autowired
    private ClassroomRepository classroomRepository;


    @Autowired
    private SeanceRepository sessionRepository;

    // Récupérer toutes les séances
    public List<SeanceDTO> getAllSessions() {
        List<Sceance> sessions = sessionRepository.findAll();
        
        // Convertir chaque séance en DTO
        return sessions.stream().map(this::convertToSeanceDTO).toList();
    }

    // Récupérer une séance par son ID
    public Optional<SeanceDTO> getSessionById(Long id) {
        Optional<Sceance> session = (Optional<Sceance>) sessionRepository.findById(id);
        return session.map(this::convertToSeanceDTO);
    }

    // Ajouter une nouvelle séance
    public SeanceDTO addSession(SeanceDTO seanceDTO) {
        Sceance session = convertToEntity(seanceDTO);
        Sceance savedSession = sessionRepository.save(session);
        return convertToSeanceDTO(savedSession);
    }

    // Mettre à jour une séance existante
    public SeanceDTO updateSession(Long id, SeanceDTO seanceDTO) {
        Optional<Sceance> session = (Optional<Sceance>) sessionRepository.findById(id);
        if (session.isPresent()) {
            Sceance existingSession = session.get();
            existingSession.setStartTime(seanceDTO.getStartTime());
            existingSession.setEndTime(seanceDTO.getEndTime());
            // Mettre à jour les autres champs si nécessaire
            Sceance updatedSession = sessionRepository.save(existingSession);
            return convertToSeanceDTO(updatedSession);
        }
        return null; // ou lever une exception si la session n'existe pas
    }

    // Supprimer une séance
    public void deleteSession(Long id) {
        sessionRepository.deleteById(id);
    }

    // Méthode pour convertir l'entité Sceance en DTO
    private SeanceDTO convertToSeanceDTO(Sceance sceance) {
        SeanceDTO dto = new SeanceDTO();
        dto.setId(sceance.getId());
        dto.setDayOfWeek(sceance.getDayOfWeek());
        dto.setStartTime(sceance.getStartTime());
        dto.setEndTime(sceance.getEndTime());
        dto.setFrequency(sceance.getFrequency());
        dto.setWasAttended(sceance.getWasAttended());
    
        // Remplir SubModuleDTO
        if (sceance.getSubModule() != null) {
            SubModuleDTO subModuleDTO = new SubModuleDTO();
            subModuleDTO.setId(sceance.getSubModule().getId());
            subModuleDTO.setName(sceance.getSubModule().getName());
            subModuleDTO.setNbrHours(sceance.getSubModule().getNbrHours());
            dto.setSubModule(subModuleDTO);
        }
    
        // Remplir GroupDTO
        if (sceance.getGroup() != null) {
            GroupDTO groupDTO = new GroupDTO();
            groupDTO.setId(sceance.getGroup().getId());
            groupDTO.setName(sceance.getGroup().getName());
            dto.setGroup(groupDTO);
        }
    
        // Remplir ClassroomDTO
        if (sceance.getClassroom() != null) {
            ClassroomDTO classroomDTO = new ClassroomDTO();
            classroomDTO.setId(sceance.getClassroom().getId());
            classroomDTO.setName(sceance.getClassroom().getName());
            classroomDTO.setCapacity(sceance.getClassroom().getCapacity());
            dto.setClassroom(classroomDTO);
        }
    
        // Remplir ModuleDTO
        if (sceance.getSubModule() != null && sceance.getSubModule().getModule() != null) {
            ModuleDTO moduleDTO = new ModuleDTO();
            moduleDTO.setId(sceance.getSubModule().getModule().getId());
            moduleDTO.setName(sceance.getSubModule().getModule().getName());
            dto.setModule(moduleDTO);
        }
    
        // Remplir ProfessorDTO
        if (sceance.getSubModule() != null && sceance.getSubModule().getTeacher() != null) {
            ProfessorDTO professorDTO = new ProfessorDTO();
            professorDTO.setId(sceance.getSubModule().getTeacher().getId());
            professorDTO.setSpecialty(sceance.getSubModule().getTeacher().getSpecialty());
            
            // Vérifier que le professeur existe dans le sous-module
            if (sceance.getSubModule().getTeacher() != null) {
                professorDTO.setFirstName(sceance.getSubModule().getTeacher().getFirstName());
            } else {
                professorDTO.setFirstName("Nom non disponible"); // Message par défaut
            }
            professorDTO.setLastName(sceance.getSubModule().getTeacher().getLastName()); 
            dto.setProfessor(professorDTO);
        }
    
        return dto;
    }
    
    // Méthode pour convertir le DTO en entité Sceance
    private Sceance convertToEntity(SeanceDTO seanceDTO) {
        Sceance session = new Sceance();
        session.setStartTime(seanceDTO.getStartTime());
        session.setEndTime(seanceDTO.getEndTime());
        session.setFrequency(seanceDTO.getFrequency());
        session.setWasAttended(seanceDTO.getWasAttended());

        // Remplir SubModule
        if (seanceDTO.getSubModule() != null) {
            SubModule subModule = new SubModule();
            subModule.setId(seanceDTO.getSubModule().getId());
            subModule.setName(seanceDTO.getSubModule().getName());
            subModule.setNbrHours(seanceDTO.getSubModule().getNbrHours());
            session.setSubModule(subModule);
        }

        // Remplir Group
        if (seanceDTO.getGroup() != null) {
            Group group = new Group();
            group.setId(seanceDTO.getGroup().getId());
            group.setName(seanceDTO.getGroup().getName());
            session.setGroup(group);
        }

        // Remplir Classroom
        if (seanceDTO.getClassroom() != null) {
            Classroom classroom = new Classroom();
            classroom.setId(seanceDTO.getClassroom().getId());
            classroom.setName(seanceDTO.getClassroom().getName());
            classroom.setCapacity(seanceDTO.getClassroom().getCapacity());
            session.setClassroom(classroom);
        }

        // Remplir Module (via SubModule)
        if (seanceDTO.getModule() != null) {
            Module module = new Module();
            module.setId(seanceDTO.getModule().getId());
            module.setName(seanceDTO.getModule().getName());
            session.setModule(module);
        }

        // Remplir Professor (via SubModule)
        if (seanceDTO.getProfessor() != null) {
            Professor professor = new Professor();
            professor.setId(seanceDTO.getProfessor().getId());
            professor.setFirstName(seanceDTO.getProfessor().getFirstName());
            professor.setLastName(seanceDTO.getProfessor().getLastName());
            professor.setSpecialty(seanceDTO.getProfessor().getSpecialty());
            session.setProfessor(professor);
        }

        return session;
    }
}
