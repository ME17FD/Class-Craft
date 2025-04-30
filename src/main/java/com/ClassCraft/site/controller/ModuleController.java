package com.ClassCraft.site.controller;

import com.ClassCraft.site.dto.ModuleDTO;
import com.ClassCraft.site.service.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    @GetMapping
    public ResponseEntity<List<ModuleDTO>> getAllModules() {
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModuleDTO> getModuleById(@PathVariable Long id) {
        return ResponseEntity.ok(moduleService.getModuleById(id));
    }

    @PostMapping
    public ResponseEntity<ModuleDTO> createModule(@RequestBody ModuleDTO moduleDTO) {
        return ResponseEntity.ok(moduleService.createModule(moduleDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModuleDTO> updateModule(
            @PathVariable Long id,
            @RequestBody ModuleDTO moduleDTO) {
        return ResponseEntity.ok(moduleService.updateModule(id, moduleDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }
}