package com.ClassCraft.site.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ClassCraft.site.dto.ModuleDTO;
import com.ClassCraft.site.models.Filiere;
import com.ClassCraft.site.models.Module;
import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.repository.FiliereRepository;
import com.ClassCraft.site.repository.ModuleRepository;
import com.ClassCraft.site.repository.ProfessorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final ProfessorRepository professorRepository;
    private final FiliereRepository filiereRepository;

    public List<ModuleDTO> getAllModules() {
        return moduleRepository.findAll().stream()
                .map(module -> {
                    ModuleDTO dto = new ModuleDTO();
                    dto.setId(module.getId());
                    dto.setName(module.getName());
                    dto.setCode(module.getCode());
                    if (module.getFiliere() != null) {
                        dto.setFiliereId(module.getFiliere().getId());
                    }
                    if (module.getProfessorInCharge() != null) {
                        dto.setProfessorInChargeId(module.getProfessorInCharge().getId());
                        dto.setProfessorInChargeName(
                            module.getProfessorInCharge().getFirstName() + " " + 
                            module.getProfessorInCharge().getLastName()
                        );
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public ModuleDTO getModuleById(Long id) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));
        return convertToDTO(module);
    }

    @Transactional
    public ModuleDTO createModule(ModuleDTO moduleDTO) {
        Module module = new Module();
        module.setName(moduleDTO.getName());
        module.setCode(moduleDTO.getCode());

        if (moduleDTO.getFiliereId() != null) {
            Filiere filiere = filiereRepository.findById(moduleDTO.getFiliereId())
                    .orElseThrow(() -> new RuntimeException("Filiere not found"));
            module.setFiliere(filiere);
        }

        if (moduleDTO.getProfessorInChargeId() != null) {
            Professor professor = professorRepository.findById(moduleDTO.getProfessorInChargeId())
                    .orElseThrow(() -> new RuntimeException("Professor not found"));
            module.setProfessorInCharge(professor);
        }

        Module savedModule = moduleRepository.save(module);
        return convertToDTO(savedModule);
    }

    @Transactional
    public ModuleDTO updateModule(Long id, ModuleDTO moduleDTO) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        module.setName(moduleDTO.getName());
        module.setCode(moduleDTO.getCode());

        if (moduleDTO.getFiliereId() != null) {
            Filiere filiere = filiereRepository.findById(moduleDTO.getFiliereId())
                    .orElseThrow(() -> new RuntimeException("Filiere not found"));
            module.setFiliere(filiere);
        } else {
            module.setFiliere(null);
        }

        if (moduleDTO.getProfessorInChargeId() != null) {
            Professor professor = professorRepository.findById(moduleDTO.getProfessorInChargeId())
                    .orElseThrow(() -> new RuntimeException("Professor not found"));
            module.setProfessorInCharge(professor);
        } else {
            module.setProfessorInCharge(null);
        }

        Module updatedModule = moduleRepository.save(module);
        return convertToDTO(updatedModule);
    }

    @Transactional
    public void deleteModule(Long id) {
        moduleRepository.deleteById(id);
    }

    private ModuleDTO convertToDTO(Module module) {
        ModuleDTO dto = new ModuleDTO();
        dto.setId(module.getId());
        dto.setName(module.getName());
        dto.setCode(module.getCode());
        
        if (module.getFiliere() != null) {
            dto.setFiliereId(module.getFiliere().getId());
        }
        
        if (module.getProfessorInCharge() != null) {
            dto.setProfessorInChargeId(module.getProfessorInCharge().getId());
            dto.setProfessorInChargeName(
                module.getProfessorInCharge().getFirstName() + " " + 
                module.getProfessorInCharge().getLastName()
            );
        }
        return dto;
    }
}