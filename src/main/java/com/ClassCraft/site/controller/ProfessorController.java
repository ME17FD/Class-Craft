package com.ClassCraft.site.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.repository.ProfessorRepository;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/professors")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorRepository professorRepository;

    @GetMapping
    public ResponseEntity<List<Professor>> getAllProfessors() {
        return ResponseEntity.ok(professorRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Professor> createProfessor(@RequestBody Professor professor) {
        return ResponseEntity.ok(professorRepository.save(professor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Professor> updateProfessor(@PathVariable Long id, @RequestBody Professor updated) {
        return professorRepository.findById(id).map(p -> {
            p.setFirstName(updated.getFirstName());
            p.setLastName(updated.getLastName());
            p.setEmail(updated.getEmail());
            return ResponseEntity.ok(professorRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfessor(@PathVariable Long id) {
        if (!professorRepository.existsById(id)) return ResponseEntity.notFound().build();
        professorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
