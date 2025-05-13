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

import com.ClassCraft.site.dto.StudentDTO;
import com.ClassCraft.site.models.Student;
import com.ClassCraft.site.repository.GroupRepository;
import com.ClassCraft.site.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

// ... other imports ...

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;
    private final GroupRepository groupRepository;

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        List<StudentDTO> dtos = studentRepository.findAll().stream()
            .map(StudentDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id)
            .map(StudentDTO::fromEntity)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StudentDTO> createStudent(@RequestBody Student student) {
        Student saved = studentRepository.save(student);
        return ResponseEntity.ok(StudentDTO.fromEntity(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable Long id, @RequestBody StudentDTO updated) {
        return studentRepository.findById(id)
            .map(student -> {
                student.setFirstName(updated.getFirstName());
                student.setLastName(updated.getLastName());
                student.setEmail(updated.getEmail());
                student.setCNE(updated.getCNE());
                student.setRegistrationNumber(updated.getRegistrationNumber());
                groupRepository.findById(updated.getGroupId()).ifPresent(group -> student.setGroup(group));
                
                Student saved = studentRepository.save(student);
                return ResponseEntity.ok(StudentDTO.fromEntity(saved));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
    if (studentRepository.existsById(id)) {
        studentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
}
}