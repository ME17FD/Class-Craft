package com.ClassCraft.site.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ClassCraft.site.dto.GroupDTO;
import com.ClassCraft.site.models.Group;
import com.ClassCraft.site.repository.GroupRepository;
import com.ClassCraft.site.service.GroupService;

@Service
@Transactional
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final ModelMapper modelMapper;

    public GroupServiceImpl(GroupRepository groupRepository, ModelMapper modelMapper) {
        this.groupRepository = groupRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public GroupDTO getById(Long id) {
        return groupRepository.findById(id)
                .map(group -> modelMapper.map(group, GroupDTO.class))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));
    }

    @Override
    public List<GroupDTO> getAll() {
        return groupRepository.findAll().stream()
                .map(group -> modelMapper.map(group, GroupDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public GroupDTO save(GroupDTO groupDTO) {
        if (groupDTO == null) {
            throw new IllegalArgumentException("GroupDTO cannot be null");
        }
        if (groupDTO.getName() == null || groupDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Group name cannot be null or empty");
        }
        Group group = modelMapper.map(groupDTO, Group.class);
        return modelMapper.map(groupRepository.save(group), GroupDTO.class);
    }

    @Override
    public GroupDTO update(Long id, GroupDTO groupDTO) {
        if (groupDTO == null) {
            throw new IllegalArgumentException("GroupDTO cannot be null");
        }
        if (groupDTO.getName() == null || groupDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Group name cannot be null or empty");
        }
        return groupRepository.findById(id)
                .map(existing -> {
                    modelMapper.map(groupDTO, existing);
                    return modelMapper.map(groupRepository.save(existing), GroupDTO.class);
                }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));
    }

    @Override
    public void delete(Long id) {
        groupRepository.deleteById(id);
    }
}
