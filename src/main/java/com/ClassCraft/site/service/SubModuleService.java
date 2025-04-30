package com.ClassCraft.site.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ClassCraft.site.dto.SubModuleDTO;
import com.ClassCraft.site.models.Module;
import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.models.SubModule;
import com.ClassCraft.site.repository.ModuleRepository;
import com.ClassCraft.site.repository.ProfessorRepository;
import com.ClassCraft.site.repository.SubModuleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubModuleService {

    private final SubModuleRepository subModuleRepository;
    private final ModuleRepository moduleRepository;
    private final ProfessorRepository professorRepository;

    public List<SubModuleDTO> getAllSubModules() {
        return subModuleRepository.findAll().stream()
                .map(subModule -> {
                    SubModuleDTO dto = new SubModuleDTO();
                    dto.setId(subModule.getId());
                    dto.setName(subModule.getName());
                    dto.setNbrHours(subModule.getNbrHours());
                    if (subModule.getModule() != null) {
                        dto.setModuleId(subModule.getModule().getId());
                        dto.setModuleName(subModule.getModule().getName());
                    }
                    if (subModule.getTeacher() != null) {
                        dto.setTeacherId(subModule.getTeacher().getId());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public SubModuleDTO getSubModuleById(Long id) {
        SubModule subModule = subModuleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubModule not found"));
        return convertToDTO(subModule);
    }

    @Transactional
    public SubModuleDTO createSubModule(SubModuleDTO subModuleDTO) {
        SubModule subModule = new SubModule();
        subModule.setName(subModuleDTO.getName());
        subModule.setNbrHours(subModuleDTO.getNbrHours());

        if (subModuleDTO.getModuleId() != null) {
            Module module = moduleRepository.findById(subModuleDTO.getModuleId())
                    .orElseThrow(() -> new RuntimeException("Module not found"));
            subModule.setModule(module);
        }

        if (subModuleDTO.getTeacherId() != null) {
            Professor teacher = professorRepository.findById(subModuleDTO.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Professor not found"));
            subModule.setTeacher(teacher);
        }

        SubModule savedSubModule = subModuleRepository.save(subModule);
        return convertToDTO(savedSubModule);
    }

    @Transactional
    public SubModuleDTO updateSubModule(Long id, SubModuleDTO subModuleDTO) {
        SubModule subModule = subModuleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubModule not found"));

        subModule.setName(subModuleDTO.getName());
        subModule.setNbrHours(subModuleDTO.getNbrHours());

        if (subModuleDTO.getModuleId() != null) {
            Module module = moduleRepository.findById(subModuleDTO.getModuleId())
                    .orElseThrow(() -> new RuntimeException("Module not found"));
            subModule.setModule(module);
        } else {
            subModule.setModule(null);
        }

        if (subModuleDTO.getTeacherId() != null) {
            Professor teacher = professorRepository.findById(subModuleDTO.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Professor not found"));
            subModule.setTeacher(teacher);
        } else {
            subModule.setTeacher(null);
        }

        SubModule updatedSubModule = subModuleRepository.save(subModule);
        return convertToDTO(updatedSubModule);
    }

    @Transactional
    public void deleteSubModule(Long id) {
        subModuleRepository.deleteById(id);
    }

    private SubModuleDTO convertToDTO(SubModule subModule) {
        SubModuleDTO dto = new SubModuleDTO();
        dto.setId(subModule.getId());
        dto.setName(subModule.getName());
        dto.setNbrHours(subModule.getNbrHours());
        
        if (subModule.getModule() != null) {
            dto.setModuleId(subModule.getModule().getId());
            dto.setModuleName(subModule.getModule().getName());
        }
        
        if (subModule.getTeacher() != null) {
            dto.setTeacherId(subModule.getTeacher().getId());
        }
        return dto;
    }
}