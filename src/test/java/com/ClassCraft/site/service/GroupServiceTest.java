package com.ClassCraft.site.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.web.server.ResponseStatusException;

import com.ClassCraft.site.dto.GroupDTO;
import com.ClassCraft.site.models.Group;
import com.ClassCraft.site.repository.GroupRepository;
import com.ClassCraft.site.service.impl.GroupServiceImpl;

@ExtendWith(MockitoExtension.class)
class GroupServiceTest {

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private GroupServiceImpl groupService;

    private Group group;
    private GroupDTO groupDTO;

    @BeforeEach
    void setUp() {
        group = new Group();
        group.setId(1L);
        group.setName("Test Group");

        groupDTO = new GroupDTO();
        groupDTO.setId(1L);
        groupDTO.setName("Test Group");
    }

    @Test
    void getById_WhenGroupExists_ShouldReturnGroup() {
        when(groupRepository.findById(1L)).thenReturn(Optional.of(group));
        when(modelMapper.map(group, GroupDTO.class)).thenReturn(groupDTO);

        GroupDTO result = groupService.getById(1L);

        assertNotNull(result);
        assertEquals(groupDTO.getId(), result.getId());
        assertEquals(groupDTO.getName(), result.getName());
    }

    @Test
    void getById_WhenGroupDoesNotExist_ShouldThrowException() {
        when(groupRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> groupService.getById(1L));
    }

    @Test
    void getAll_ShouldReturnAllGroups() {
        List<Group> groups = Arrays.asList(group);
        when(groupRepository.findAll()).thenReturn(groups);
        when(modelMapper.map(any(Group.class), eq(GroupDTO.class))).thenReturn(groupDTO);

        List<GroupDTO> result = groupService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(groupDTO.getId(), result.get(0).getId());
    }

    @Test
    void save_ShouldSaveGroup() {
        when(modelMapper.map(groupDTO, Group.class)).thenReturn(group);
        when(groupRepository.save(any(Group.class))).thenReturn(group);
        when(modelMapper.map(group, GroupDTO.class)).thenReturn(groupDTO);

        GroupDTO result = groupService.save(groupDTO);

        assertNotNull(result);
        assertEquals(groupDTO.getId(), result.getId());
        assertEquals(groupDTO.getName(), result.getName());
    }

    @Test
    void update_WhenGroupExists_ShouldUpdateGroup() {
        when(groupRepository.findById(1L)).thenReturn(Optional.of(group));
        lenient().when(modelMapper.map(any(GroupDTO.class), eq(Group.class))).thenReturn(group);
        lenient().when(modelMapper.map(any(Group.class), eq(GroupDTO.class))).thenReturn(groupDTO);
        when(groupRepository.save(any(Group.class))).thenReturn(group);

        GroupDTO result = groupService.update(1L, groupDTO);

        assertNotNull(result);
        assertEquals(groupDTO.getId(), result.getId());
        assertEquals(groupDTO.getName(), result.getName());
    }

    @Test
    void update_WhenGroupDoesNotExist_ShouldThrowException() {
        when(groupRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> groupService.update(1L, groupDTO));
    }

    @Test
    void delete_ShouldDeleteGroup() {
        doNothing().when(groupRepository).deleteById(1L);

        groupService.delete(1L);

        verify(groupRepository).deleteById(1L);
    }

    @Test
    void save_WithNullGroupDTO_ShouldThrowException() {
        assertThrows(IllegalArgumentException.class, () -> groupService.save(null));
    }

    @Test
    void update_WithNullGroupDTO_ShouldThrowException() {
        assertThrows(IllegalArgumentException.class, () -> groupService.update(1L, null));
    }

    @Test
    void save_WithEmptyGroupName_ShouldThrowException() {
        groupDTO.setName("");
        assertThrows(IllegalArgumentException.class, () -> groupService.save(groupDTO));
    }

    @Test
    void update_WithEmptyGroupName_ShouldThrowException() {
        groupDTO.setName("");
        assertThrows(IllegalArgumentException.class, () -> groupService.update(1L, groupDTO));
    }
} 