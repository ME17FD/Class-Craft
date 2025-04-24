package com.ClassCraft.site.service;

import com.ClassCraft.site.dto.GroupDTO;

import java.util.List;

public interface GroupService {
    GroupDTO getById(Long id);
    List<GroupDTO> getAll();
    GroupDTO save(GroupDTO groupDTO);
    GroupDTO update(Long id, GroupDTO groupDTO);
    void delete(Long id);
}
