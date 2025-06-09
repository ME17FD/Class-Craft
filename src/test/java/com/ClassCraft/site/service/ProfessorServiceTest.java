package com.ClassCraft.site.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.ClassCraft.site.dto.ProfessorDTO;
import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.repository.ProfessorRepository;
import com.ClassCraft.site.service.impl.ProfessorServiceImpl;

@ExtendWith(MockitoExtension.class)
class ProfessorServiceTest {

    @Mock
    private ProfessorRepository professorRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private ProfessorServiceImpl professorService;

    private Professor professor;
    private ProfessorDTO professorDTO;

    @BeforeEach
    void setUp() {
        professor = new Professor();
        professor.setId(1L);
        professor.setFirstName("John");
        professor.setLastName("Doe");
        professor.setEmail("professor@example.com");
        professor.setSpecialty("Computer Science");
        professor.setApproved(false);

        professorDTO = new ProfessorDTO();
        professorDTO.setId(1L);
        professorDTO.setFirstName("John");
        professorDTO.setLastName("Doe");
        professorDTO.setEmail("professor@example.com");
        professorDTO.setSpecialty("Computer Science");
    }

    @Test
    void create_WhenEmailDoesNotExist_ShouldCreateProfessor() {
        when(professorRepository.existsByEmail(professorDTO.getEmail())).thenReturn(false);
        when(modelMapper.map(professorDTO, Professor.class)).thenReturn(professor);
        when(professorRepository.save(any(Professor.class))).thenReturn(professor);
        when(modelMapper.map(professor, ProfessorDTO.class)).thenReturn(professorDTO);

        ProfessorDTO result = professorService.create(professorDTO);

        assertNotNull(result);
        assertEquals(professorDTO.getEmail(), result.getEmail());
        verify(professorRepository).save(any(Professor.class));
    }

    @Test
    void create_WhenEmailExists_ShouldThrowException() {
        when(professorRepository.existsByEmail(professorDTO.getEmail())).thenReturn(true);

        assertThrows(ResponseStatusException.class, () -> professorService.create(professorDTO));
        verify(professorRepository, never()).save(any(Professor.class));
    }

    @Test
    void getById_WhenProfessorExists_ShouldReturnProfessor() {
        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));
        when(modelMapper.map(professor, ProfessorDTO.class)).thenReturn(professorDTO);

        Optional<ProfessorDTO> result = professorService.getById(1L);

        assertTrue(result.isPresent());
        assertEquals(professorDTO.getEmail(), result.get().getEmail());
    }

    @Test
    void getById_WhenProfessorDoesNotExist_ShouldReturnEmpty() {
        when(professorRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<ProfessorDTO> result = professorService.getById(1L);

        assertTrue(result.isEmpty());
    }

    @Test
    void getAll_ShouldReturnAllProfessors() {
        List<Professor> professors = Arrays.asList(professor);
        when(professorRepository.findAll()).thenReturn(professors);
        when(modelMapper.map(professor, ProfessorDTO.class)).thenReturn(professorDTO);

        List<ProfessorDTO> result = professorService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(professorDTO.getEmail(), result.get(0).getEmail());
    }

    @Test
    void update_WhenProfessorExists_ShouldUpdateProfessor() {
        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));
        when(professorRepository.save(any(Professor.class))).thenReturn(professor);
        when(modelMapper.map(professor, ProfessorDTO.class)).thenReturn(professorDTO);

        ProfessorDTO result = professorService.update(1L, professorDTO);

        assertNotNull(result);
        assertEquals(professorDTO.getEmail(), result.getEmail());
        verify(professorRepository).save(any(Professor.class));
    }

    @Test
    void update_WhenProfessorDoesNotExist_ShouldThrowException() {
        when(professorRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> professorService.update(1L, professorDTO));
        verify(professorRepository, never()).save(any(Professor.class));
    }

    @Test
    void delete_ShouldDeleteProfessor() {
        doNothing().when(professorRepository).deleteById(1L);

        professorService.delete(1L);

        verify(professorRepository).deleteById(1L);
    }

    @Test
    void approveUser_WhenProfessorExists_ShouldApproveProfessor() {
        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));
        when(professorRepository.save(any(Professor.class))).thenReturn(professor);

        boolean result = professorService.approveUser(1L);

        assertTrue(result);
        assertTrue(professor.getApproved());
        verify(professorRepository).save(professor);
    }

    @Test
    void approveUser_WhenProfessorDoesNotExist_ShouldReturnFalse() {
        when(professorRepository.findById(1L)).thenReturn(Optional.empty());

        boolean result = professorService.approveUser(1L);

        assertFalse(result);
        verify(professorRepository, never()).save(any(Professor.class));
    }

    @Test
    void findByEmail_WhenProfessorExists_ShouldReturnProfessor() {
        when(professorRepository.findByEmail("professor@example.com")).thenReturn(Optional.of(professor));

        Professor result = (Professor) professorService.findByEmail("professor@example.com");

        assertNotNull(result);
        assertEquals("professor@example.com", result.getEmail());
    }

    @Test
    void findByEmail_WhenProfessorDoesNotExist_ShouldThrowException() {
        when(professorRepository.findByEmail("professor@example.com")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> professorService.findByEmail("professor@example.com"));
    }

    @Test
    void existsByEmail_ShouldReturnTrueWhenEmailExists() {
        when(professorRepository.existsByEmail("professor@example.com")).thenReturn(true);

        boolean result = professorService.existsByEmail("professor@example.com");

        assertTrue(result);
    }

    @Test
    void existsByEmail_ShouldReturnFalseWhenEmailDoesNotExist() {
        when(professorRepository.existsByEmail("professor@example.com")).thenReturn(false);

        boolean result = professorService.existsByEmail("professor@example.com");

        assertFalse(result);
    }

    @Test
    void findBySpecialty_ShouldReturnProfessorsWithMatchingSpecialty() {
        List<Professor> professors = Arrays.asList(professor);
        when(professorRepository.findBySpecialty("Computer Science")).thenReturn(professors);
        when(modelMapper.map(professor, ProfessorDTO.class)).thenReturn(professorDTO);

        List<ProfessorDTO> result = professorService.findBySpecialty("Computer Science");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(professorDTO.getSpecialty(), result.get(0).getSpecialty());
    }
} 