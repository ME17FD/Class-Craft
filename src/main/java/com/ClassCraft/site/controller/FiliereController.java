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

import com.ClassCraft.site.dto.FiliereDTO;
import com.ClassCraft.site.models.Filiere;
import com.ClassCraft.site.repository.FiliereRepository;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/filieres")
@RequiredArgsConstructor
public class FiliereController {

    private final FiliereRepository filiereRepository;

    @GetMapping
public ResponseEntity<List<FiliereDTO>> getAllFilieres() {
    List<Filiere> filieres = filiereRepository.findAll();
    
    List<FiliereDTO> dtos = filieres.stream()
        .map(f -> {
            FiliereDTO dto = new FiliereDTO();
            dto.setId(f.getId());
            dto.setName(f.getName());
            dto.setDescription(f.getDescription());
            dto.setSessionId(f.getSession() != null ? f.getSession().getId() : null);
            return dto;
        })
        .collect(Collectors.toList());
    
    return ResponseEntity.ok(dtos);
}
    @PostMapping
    public ResponseEntity<Filiere> createFiliere(@RequestBody Filiere filiere) {
        return ResponseEntity.ok(filiereRepository.save(filiere));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Filiere> updateFiliere(@PathVariable Long id, @RequestBody Filiere updated) {
        return filiereRepository.findById(id).map(f -> {
            f.setName(updated.getName());
            return ResponseEntity.ok(filiereRepository.save(f));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFiliere(@PathVariable Long id) {
        if (!filiereRepository.existsById(id)) return ResponseEntity.notFound().build();
        filiereRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
