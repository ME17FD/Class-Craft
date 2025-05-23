package com.ClassCraft.site.controller;

import java.util.List;
import java.util.Optional;
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

import com.ClassCraft.site.dto.GroupDTO;
import com.ClassCraft.site.dto.GroupDTO.StudentInfoDTO;
import com.ClassCraft.site.dto.ModuleDTO;
import com.ClassCraft.site.dto.StudentGroupUpdateRequest;
import com.ClassCraft.site.models.Filiere;
import com.ClassCraft.site.models.Group;
import com.ClassCraft.site.models.Module;
import com.ClassCraft.site.models.Student;
import com.ClassCraft.site.repository.FiliereRepository;
import com.ClassCraft.site.repository.GroupRepository;
import com.ClassCraft.site.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupRepository groupRepository;
    private final FiliereRepository filiereRepository;
    private final StudentRepository studentRepository;

    @GetMapping
    public ResponseEntity<List<GroupDTO>> getAllGroups() {
        List<Group> groups = groupRepository.findAll();

        List<GroupDTO> dtos = groups.stream().map(group -> {
            List<StudentInfoDTO> studentDTOs = group.getStudents().stream().map(student
                    -> new StudentInfoDTO(
                            student.getId(),
                            student.getFirstName(),
                            student.getLastName(),
                            student.getEmail(),
                            student.getCNE(),
                            student.getRegistrationNumber()
                    )
            ).collect(Collectors.toList());

            Long filiereId = (group.getFiliere() != null) ? group.getFiliere().getId() : null;
            String filiereName = (group.getFiliere() != null) ? group.getFiliere().getName() : null;
            List<ModuleDTO> moduleDTOs = group.getFiliere() != null
                    ? group.getFiliere().getModules().stream().map(module -> {
                        return createModuleDTO(module);
                    }).collect(Collectors.toList())
                    : List.of();
            GroupDTO dto = new GroupDTO(
                    group.getId(),
                    group.getName(),
                    studentDTOs.size(),
                    filiereId,
                    filiereName,
                    studentDTOs
            );
            dto.setModules(moduleDTOs);
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private ModuleDTO createModuleDTO(Module module) {
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
                    module.getProfessorInCharge().getFirstName() + " " + module.getProfessorInCharge().getLastName()
            );
        }

        return dto;
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDTO> getGroupById(@PathVariable Long id) {
        Optional<Group> optionalGroup = groupRepository.findById(id);
        if (optionalGroup.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Group group = optionalGroup.get();
        List<StudentInfoDTO> studentDTOs = group.getStudents().stream().map(student
                -> new StudentInfoDTO(
                        student.getId(),
                        student.getFirstName(),
                        student.getLastName(),
                        student.getEmail(),
                        student.getCNE(),
                        student.getRegistrationNumber()
                )
        ).collect(Collectors.toList());

        Long filiereId = (group.getFiliere() != null) ? group.getFiliere().getId() : null;
        String filiereName = (group.getFiliere() != null) ? group.getFiliere().getName() : null;

        GroupDTO dto = new GroupDTO(
                group.getId(),
                group.getName(),
                studentDTOs.size(),
                filiereId,
                filiereName,
                studentDTOs
        );

        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<GroupDTO> createGroup(@RequestBody GroupDTO groupDTO) {
        // Map GroupDTO to Group entity
        Group newGroup = new Group();
        newGroup.setName(groupDTO.getName());

        // If Filiere is provided in DTO, set it
        if (groupDTO.getFiliereId() != null) {
            Optional<Filiere> filiere = filiereRepository.findById(groupDTO.getFiliereId());
            filiere.ifPresent(newGroup::setFiliere);
        }

        Group savedGroup = groupRepository.save(newGroup);

        Long filiereId = (savedGroup.getFiliere() != null) ? savedGroup.getFiliere().getId() : null;
        String filiereName = (savedGroup.getFiliere() != null) ? savedGroup.getFiliere().getName() : null;

        GroupDTO savedGroupDTO = new GroupDTO(
                savedGroup.getId(),
                savedGroup.getName(),
                0,
                filiereId,
                filiereName,
                null
        );

        // Return the saved GroupDTO as a response
        return ResponseEntity.ok(savedGroupDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        if (!groupRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        groupRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupDTO> updateGroup(@PathVariable Long id, @RequestBody GroupDTO groupDTO) {
        Optional<Group> optionalGroup = groupRepository.findById(id);
        if (optionalGroup.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Group group = optionalGroup.get();
        group.setName(groupDTO.getName());

        // Update Filiere if provided
        if (groupDTO.getFiliereId() != null) {
            Optional<Filiere> filiere = filiereRepository.findById(groupDTO.getFiliereId());
            filiere.ifPresent(group::setFiliere);
        }

        Group updatedGroup = groupRepository.save(group);

        Long filiereId = (updatedGroup.getFiliere() != null) ? updatedGroup.getFiliere().getId() : null;
        String filiereName = (updatedGroup.getFiliere() != null) ? updatedGroup.getFiliere().getName() : null;

        GroupDTO updatedGroupDTO = new GroupDTO(
                updatedGroup.getId(),
                updatedGroup.getName(),
                updatedGroup.getStudents().size(),
                filiereId,
                filiereName,
                updatedGroup.getStudents().stream().map(student
                        -> new StudentInfoDTO(
                        student.getId(),
                        student.getFirstName(),
                        student.getLastName(),
                        student.getEmail(),
                        student.getCNE(),
                        student.getRegistrationNumber()
                )
                ).collect(Collectors.toList())
        );

        return ResponseEntity.ok(updatedGroupDTO);
    }

    @PutMapping("/{id}/students")
    public ResponseEntity<?> assignStudentsToGroup(
            @PathVariable Long id,
            @RequestBody StudentGroupUpdateRequest request
    ) {
        Optional<Group> optionalGroup = groupRepository.findById(id);
        if (optionalGroup.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Group group = optionalGroup.get();

        List<Student> students = studentRepository.findAllById(request.getStudentIds());
        for (Student student : students) {
            student.setGroup(group);
        }

        studentRepository.saveAll(students);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/students")
    public ResponseEntity<?> removeStudentsFromGroup(
            @PathVariable Long id,
            @RequestBody StudentGroupUpdateRequest request
    ) {
        List<Student> students = studentRepository.findAllById(request.getStudentIds());
        for (Student student : students) {
            if (student.getGroup() != null && student.getGroup().getId().equals(id)) {
                student.setGroup(null);
            }
        }

        studentRepository.saveAll(students);
        return ResponseEntity.ok().build();
    }

}
