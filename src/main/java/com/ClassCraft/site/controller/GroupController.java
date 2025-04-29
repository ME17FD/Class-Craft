package com.ClassCraft.site.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ClassCraft.site.repository.*;
import com.ClassCraft.site.dto.*;
import com.ClassCraft.site.dto.GroupDTO.StudentInfoDTO;
import com.ClassCraft.site.models.Group;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {
    
    private final GroupRepository groupRepository;
    private final StudentRepository studentRepository;

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

        return new GroupDTO(
            group.getId(),
            group.getName(),
            studentDTOs.size(),
            filiereId,
            studentDTOs
        );
    }).collect(Collectors.toList());

    return ResponseEntity.ok(dtos);
}

}
