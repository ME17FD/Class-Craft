package com.ClassCraft.site.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ClassCraft.site.dto.ModuleDTO;
import com.ClassCraft.site.dto.ProfessorDTO;
import com.ClassCraft.site.dto.SubModuleDTO;
import com.ClassCraft.site.models.Module;
import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.models.SubModule;
import com.ClassCraft.site.repository.ModuleRepository;
import com.ClassCraft.site.repository.ProfessorRepository;
import com.ClassCraft.site.repository.SubModuleRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/professors")
@RequiredArgsConstructor
public class ProfessorController {

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private SubModuleRepository subModuleRepository;

    private final ProfessorRepository professorRepository;

    @GetMapping
    public ResponseEntity<List<ProfessorDTO>> getAllProfessors() {
        List<Professor> professors = professorRepository.findAll();

        List<ProfessorDTO> dtoList = professors.stream()
                .map(professor -> {
                    ProfessorDTO dto = new ProfessorDTO();
                    dto.setId(professor.getId());
                    dto.setFirstName(professor.getFirstName());
                    dto.setLastName(professor.getLastName());
                    dto.setEmail(professor.getEmail());
                    dto.setSpecialty(professor.getSpecialty());
                    dto.setGrade(professor.getGrade());

                    // Fetch modules and submodules assigned to this professor
                    List<SubModule> subModuleEntities = subModuleRepository.findByTeacher(professor);
                    List<SubModuleDTO> subModules = subModuleEntities.stream().map(sm -> {
                        SubModuleDTO sbdto = new SubModuleDTO();
                        sbdto.setId(sm.getId());
                        sbdto.setName(sm.getName());
                        sbdto.setNbrHours(sm.getNbrHours());

                        if (sm.getModule() != null) {
                            sbdto.setModuleId(sm.getModule().getId());
                            sbdto.setModuleName(sm.getModule().getName());
                        }

                        if (sm.getTeacher() != null) {
                            sbdto.setTeacherId(sm.getTeacher().getId());
                            ProfessorDTO profDto = new ProfessorDTO();
                            profDto.setId(sm.getTeacher().getId());
                            profDto.setFirstName(sm.getTeacher().getFirstName());
                            profDto.setLastName(sm.getTeacher().getLastName());
                            profDto.setEmail(sm.getTeacher().getEmail());
                            profDto.setSpecialty(sm.getTeacher().getSpecialty());
                            profDto.setGrade(sm.getTeacher().getGrade());
                            sbdto.setTeacher(profDto);
                        }

                        return sbdto;
                    }).toList();
                    List<Module> moduleEntities = moduleRepository.findByProfessorInCharge(professor);

                    List<ModuleDTO> modules = moduleEntities.stream().map(module -> {
                        ModuleDTO mddto = new ModuleDTO();
                        mddto.setId(module.getId());
                        mddto.setName(module.getName());
                        mddto.setCode(module.getCode());

                        if (module.getFiliere() != null) {
                            mddto.setFiliereId(module.getFiliere().getId());
                        }

                        if (module.getProfessorInCharge() != null) {
                            mddto.setProfessorInChargeId(module.getProfessorInCharge().getId());
                            ProfessorDTO profDto = new ProfessorDTO();
                            profDto.setId(module.getProfessorInCharge().getId());
                            profDto.setFirstName(module.getProfessorInCharge().getFirstName());
                            profDto.setLastName(module.getProfessorInCharge().getLastName());
                            profDto.setEmail(module.getProfessorInCharge().getEmail());
                            profDto.setSpecialty(module.getProfessorInCharge().getSpecialty());
                            profDto.setGrade(module.getProfessorInCharge().getGrade());
                            mddto.setProfessorInCharge(profDto);
                            mddto.setProfessorInChargeName(profDto.getLastName() + " " + profDto.getFirstName());
                        }

                        // Convert nested SubModules for this Module
                        List<SubModuleDTO> subModuleDTOs = module.getSubModules().stream().map(sm -> {
                            SubModuleDTO subDto = new SubModuleDTO();
                            subDto.setId(sm.getId());
                            subDto.setName(sm.getName());
                            subDto.setNbrHours(sm.getNbrHours());
                            subDto.setModuleId(module.getId());
                            subDto.setModuleName(module.getName());

                            if (sm.getTeacher() != null) {
                                subDto.setTeacherId(sm.getTeacher().getId());
                                ProfessorDTO teacherDto = new ProfessorDTO();
                                teacherDto.setId(sm.getTeacher().getId());
                                teacherDto.setFirstName(sm.getTeacher().getFirstName());
                                teacherDto.setLastName(sm.getTeacher().getLastName());
                                teacherDto.setEmail(sm.getTeacher().getEmail());
                                teacherDto.setSpecialty(sm.getTeacher().getSpecialty());
                                teacherDto.setGrade(sm.getTeacher().getGrade());
                                subDto.setTeacher(teacherDto);
                            }

                            return subDto;
                        }).toList();

                        mddto.setSubModules(subModuleDTOs);

                        return mddto;
                    }).toList();

                    dto.setModules(modules);
                    dto.setSubModules(subModules);
                    return dto;
                }).toList();

        return ResponseEntity.ok(dtoList);
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
        if (!professorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        professorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
