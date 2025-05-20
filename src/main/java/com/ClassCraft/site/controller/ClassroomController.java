package com.ClassCraft.site.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ClassCraft.site.dto.ClassroomDTO;
import com.ClassCraft.site.models.Classroom;
import com.ClassCraft.site.repository.ClassroomRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/classrooms")
@RequiredArgsConstructor
public class ClassroomController {

    private final ClassroomRepository classroomRepository;

    // Récupérer toutes les classes de salles
    @GetMapping
    public ResponseEntity<List<ClassroomDTO>> getAllClassrooms() {
        List<Classroom> classrooms = classroomRepository.findAll();
        List<ClassroomDTO> dtos = classrooms.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Récupérer une salle par son ID
    @GetMapping("/{id}")
    public ResponseEntity<ClassroomDTO> getClassroom(@PathVariable Long id) {
        return classroomRepository.findById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Créer une nouvelle salle
    @PostMapping
    public ResponseEntity<ClassroomDTO> createClassroom(@RequestBody ClassroomDTO dto) {
        Classroom saved = classroomRepository.save(convertToEntity(dto));
        return ResponseEntity.ok(convertToDTO(saved));
    }

    // Mettre à jour une salle existante
    @PutMapping("/{id}")
    public ResponseEntity<ClassroomDTO> updateClassroom(@PathVariable Long id, @RequestBody ClassroomDTO dto) {
        return classroomRepository.findById(id).map(existing -> {
            Classroom updated = updateEntity(existing, dto);
            Classroom saved = classroomRepository.save(updated);
            return ResponseEntity.ok(convertToDTO(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Supprimer une salle par son ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassroom(@PathVariable Long id) {
        if (!classroomRepository.existsById(id)) return ResponseEntity.notFound().build();
        classroomRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ======== Helper methods ========

    // Convertir une entité Classroom en DTO
    private ClassroomDTO convertToDTO(Classroom classroom) {
        ClassroomDTO dto = new ClassroomDTO();
        dto.setId(classroom.getId());
        dto.setName(classroom.getName());
        dto.setCapacity(classroom.getCapacity());
        dto.setType(classroom.getType()); // Ajouter le type directement
        return dto;
    }

    // Convertir un DTO en entité Classroom
    private Classroom convertToEntity(ClassroomDTO dto) {
        if (dto.getType() == null) {
            throw new IllegalArgumentException("Classroom type cannot be null");
        }

        Classroom classroom = new Classroom();
        classroom.setName(dto.getName());
        classroom.setCapacity(dto.getCapacity());
        classroom.setType(dto.getType());
        return classroom;
    }


    // Mettre à jour l'entité Classroom existante
    private Classroom updateEntity(Classroom existing, ClassroomDTO dto) {
        existing.setName(dto.getName());
        existing.setCapacity(dto.getCapacity());
        existing.setType(dto.getType());
        return existing;
    }
}
