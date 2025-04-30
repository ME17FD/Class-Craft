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
import com.ClassCraft.site.models.Filiere;
import com.ClassCraft.site.models.Group;
import com.ClassCraft.site.repository.FiliereRepository;
import com.ClassCraft.site.repository.GroupRepository;
import com.ClassCraft.site.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupRepository groupRepository;
    private final StudentRepository studentRepository;
    private final FiliereRepository filiereRepository;

    

    @GetMapping
    public ResponseEntity<List<GroupDTO>> getAllGroups() {
        List<Group> groups = groupRepository.findAll();

        List<GroupDTO> dtos = groups.stream().map(group -> {
            List<StudentInfoDTO> studentDTOs = group.getStudents().stream().map(student ->
                new StudentInfoDTO(
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

            return new GroupDTO(
                group.getId(),
                group.getName(),
                studentDTOs.size(),
                filiereId,
                filiereName,
                studentDTOs
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDTO> getGroupById(@PathVariable Long id) {
        Optional<Group> optionalGroup = groupRepository.findById(id);
        if (optionalGroup.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Group group = optionalGroup.get();
        List<StudentInfoDTO> studentDTOs = group.getStudents().stream().map(student ->
            new StudentInfoDTO(
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
    public ResponseEntity<Group> createGroup(@RequestBody Group newGroup) {
        // Optionally check for filiere existence
        if (newGroup.getFiliere() != null) {
            Optional<Filiere> filiere = filiereRepository.findById(newGroup.getFiliere().getId());
            filiere.ifPresent(newGroup::setFiliere);
        }

        Group savedGroup = groupRepository.save(newGroup);
        return ResponseEntity.ok(savedGroup);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(@PathVariable Long id, @RequestBody Group updatedGroup) {
        Optional<Group> optionalGroup = groupRepository.findById(id);
        if (optionalGroup.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Group group = optionalGroup.get();
        group.setName(updatedGroup.getName());
        group.setFiliere(updatedGroup.getFiliere()); // You may want to verify Filiere exists

        Group saved = groupRepository.save(group);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        if (!groupRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        groupRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
