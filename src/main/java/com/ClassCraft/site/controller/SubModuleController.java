package com.ClassCraft.site.controller;

import com.ClassCraft.site.dto.SubModuleDTO;
import com.ClassCraft.site.service.SubModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submodules")
@RequiredArgsConstructor
public class SubModuleController {

    private final SubModuleService subModuleService;

    @GetMapping
    public ResponseEntity<List<SubModuleDTO>> getAllSubModules() {
        return ResponseEntity.ok(subModuleService.getAllSubModules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubModuleDTO> getSubModuleById(@PathVariable Long id) {
        return ResponseEntity.ok(subModuleService.getSubModuleById(id));
    }

    @PostMapping
    public ResponseEntity<SubModuleDTO> createSubModule(@RequestBody SubModuleDTO subModuleDTO) {
        return ResponseEntity.ok(subModuleService.createSubModule(subModuleDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubModuleDTO> updateSubModule(
            @PathVariable Long id,
            @RequestBody SubModuleDTO subModuleDTO) {
        return ResponseEntity.ok(subModuleService.updateSubModule(id, subModuleDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubModule(@PathVariable Long id) {
        subModuleService.deleteSubModule(id);
        return ResponseEntity.noContent().build();
    }
}