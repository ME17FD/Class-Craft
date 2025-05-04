package com.ClassCraft.site.controller;

import com.ClassCraft.site.dto.SeanceDTO;
import com.ClassCraft.site.service.impl.SeanceServiceImpl;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/seances")
public class SeanceController {

    @Autowired
    private SeanceServiceImpl seanceService;

    // Obtenir toutes les séances
    @GetMapping
    public ResponseEntity<List<SeanceDTO>> getAllSessions() {
        List<SeanceDTO> sessions = seanceService.getAllSessions(); // Récupérer toutes les séances
        return ResponseEntity.ok(sessions);
    }

    // Obtenir une séance par son ID
    @GetMapping("/{id}")
    public ResponseEntity<SeanceDTO> getSessionById(@PathVariable Long id) {
        Optional<SeanceDTO> sessionDTO = seanceService.getSessionById(id);  // Récupérer la séance par ID
        return sessionDTO.map(ResponseEntity::ok) // Si trouvée, renvoyer OK avec la séance
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());  // Sinon, renvoyer 404 Not Found
    }

    // Ajouter une nouvelle séance
    @PostMapping
    public ResponseEntity<SeanceDTO> addSession(@RequestBody SeanceDTO seanceDTO) {
        SeanceDTO newSessionDTO = seanceService.addSession(seanceDTO);  // Ajouter la séance
        return ResponseEntity.status(HttpStatus.CREATED).body(newSessionDTO);  // Retourner la séance créée avec statut 201 Created
    }

    // Mettre à jour une séance existante
    @PutMapping("/{id}")
    public ResponseEntity<SeanceDTO> updateSession(@PathVariable Long id, @RequestBody SeanceDTO seanceDTO) {
        SeanceDTO updatedSessionDTO = seanceService.updateSession(id, seanceDTO);  // Mettre à jour la séance
        return updatedSessionDTO != null ? ResponseEntity.ok(updatedSessionDTO) : 
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // Si mise à jour réussie, renvoyer OK, sinon 404 Not Found
    }

    // Supprimer une séance
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        seanceService.deleteSession(id);  // Supprimer la séance
        return ResponseEntity.noContent().build();  // Retourner No Content (204) après suppression réussie
    }
}
