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

import com.ClassCraft.site.dto.AmphitheatreDTO;
import com.ClassCraft.site.dto.ClassroomDTO;
import com.ClassCraft.site.dto.SalleDTO;
import com.ClassCraft.site.models.Amphitheatre;
import com.ClassCraft.site.models.Classroom;
import com.ClassCraft.site.models.Salle;
import com.ClassCraft.site.repository.ClassroomRepository;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/classrooms")
@RequiredArgsConstructor
public class ClassroomController {

    private final ClassroomRepository classroomRepository;

    @GetMapping
    public ResponseEntity<List<ClassroomDTO>> getAllClassrooms() {
        List<Classroom> classrooms = classroomRepository.findAll();
        List<ClassroomDTO> dtos = classrooms.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassroomDTO> getClassroom(@PathVariable Long id) {
        return classroomRepository.findById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClassroomDTO> createClassroom(@RequestBody ClassroomDTO dto) {
        Classroom saved = classroomRepository.save(convertToEntity(dto));
        return ResponseEntity.ok(convertToDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassroomDTO> updateClassroom(@PathVariable Long id, @RequestBody ClassroomDTO dto) {
        return classroomRepository.findById(id).map(existing -> {
            Classroom updated = updateEntity(existing, dto);
            Classroom saved = classroomRepository.save(updated);
            return ResponseEntity.ok(convertToDTO(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassroom(@PathVariable Long id) {
        if (!classroomRepository.existsById(id)) return ResponseEntity.notFound().build();
        classroomRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ======== Helper methods ========

    private ClassroomDTO convertToDTO(Classroom classroom) {
        if (classroom instanceof Salle salle) {
            SalleDTO dto = new SalleDTO();
            dto.setId(salle.getId());
            dto.setName(salle.getName());
            dto.setCapacity(salle.getCapacity());
            dto.setHasProjector(salle.getHasProjector());
            return dto;
        } else if (classroom instanceof Amphitheatre amp) {
            AmphitheatreDTO dto = new AmphitheatreDTO();
            dto.setId(amp.getId());
            dto.setName(amp.getName());
            dto.setCapacity(amp.getCapacity());
            dto.setHasMicrophone(amp.getHasMicrophone());
            return dto;
        } else {
            throw new IllegalArgumentException("Unknown classroom type");
        }
    }

    private Classroom convertToEntity(ClassroomDTO dto) {
        if ("SALLE".equals(dto.getType())) {
            Salle salle = new Salle();
            salle.setId(dto.getId());
            salle.setName(dto.getName());
            salle.setCapacity(dto.getCapacity());
            salle.setHasProjector(((SalleDTO) dto).getHasProjector());
            return salle;
        } else if ("AMPHITHEATRE".equals(dto.getType())) {
            Amphitheatre amp = new Amphitheatre();
            amp.setId(dto.getId());
            amp.setName(dto.getName());
            amp.setCapacity(dto.getCapacity());
            amp.setHasMicrophone(((AmphitheatreDTO) dto).getHasMicrophone());
            return amp;
        } else {
            throw new IllegalArgumentException("Invalid type: " + dto.getType());
        }
    }

    private Classroom updateEntity(Classroom existing, ClassroomDTO dto) {
        existing.setName(dto.getName());
        existing.setCapacity(dto.getCapacity());

        if (existing instanceof Salle salle && dto instanceof SalleDTO salleDTO) {
            salle.setHasProjector(salleDTO.getHasProjector());
        } else if (existing instanceof Amphitheatre amp && dto instanceof AmphitheatreDTO ampDTO) {
            amp.setHasMicrophone(ampDTO.getHasMicrophone());
        }

        return existing;
    }
}
