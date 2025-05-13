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
public ResponseEntity<FiliereDTO> createFiliere(@RequestBody FiliereDTO filiereDTO) {
    Filiere filiere = new Filiere();
    filiere.setName(filiereDTO.getName());
    filiere.setDescription(filiereDTO.getDescription());
    // Assuming you have a way to get the session by its ID
    // filiere.setSession(sessionRepository.findById(filiereDTO.getSessionId()).orElse(null));
    
    Filiere savedFiliere = filiereRepository.save(filiere);
    FiliereDTO savedDTO = new FiliereDTO();
    savedDTO.setId(savedFiliere.getId());
    savedDTO.setName(savedFiliere.getName());
    savedDTO.setDescription(savedFiliere.getDescription());
    savedDTO.setSessionId(savedFiliere.getSession() != null ? savedFiliere.getSession().getId() : null);
    
    return ResponseEntity.ok(savedDTO);
}

    @PutMapping("/{id}")
    public ResponseEntity<FiliereDTO> updateFiliere(@PathVariable Long id, @RequestBody FiliereDTO updatedDTO) {
        return filiereRepository.findById(id).map(f -> {
            f.setName(updatedDTO.getName());
            f.setDescription(updatedDTO.getDescription());
            // Assuming you have a way to get the session by its ID
            // f.setSession(sessionRepository.findById(updatedDTO.getSessionId()).orElse(null));

            Filiere updatedFiliere = filiereRepository.save(f);
            FiliereDTO updatedResponseDTO = new FiliereDTO();
            updatedResponseDTO.setId(updatedFiliere.getId());
            updatedResponseDTO.setName(updatedFiliere.getName());
            updatedResponseDTO.setDescription(updatedFiliere.getDescription());
            updatedResponseDTO.setSessionId(updatedFiliere.getSession() != null ? updatedFiliere.getSession().getId() : null);
            
            return ResponseEntity.ok(updatedResponseDTO);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFiliere(@PathVariable Long id) {
        if (!filiereRepository.existsById(id)) return ResponseEntity.notFound().build();
        filiereRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
