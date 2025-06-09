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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.ClassCraft.site.dto.StudentDTO;
import com.ClassCraft.site.models.Student;
import com.ClassCraft.site.repository.StudentRepository;
import com.ClassCraft.site.service.impl.StudentServiceImpl;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private StudentServiceImpl studentService;

    private Student student;
    private StudentDTO studentDTO;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setId(1L);
        student.setEmail("test@example.com");
        student.setPassword("password");
        student.setApproved(false);

        studentDTO = new StudentDTO();
        studentDTO.setId(1L);
        studentDTO.setEmail("test@example.com");
        studentDTO.setPassword("password");
    }

    @Test
    void create_WhenEmailDoesNotExist_ShouldCreateStudent() {
        when(studentRepository.existsByEmail(studentDTO.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(studentDTO.getPassword())).thenReturn("encodedPassword");
        when(modelMapper.map(studentDTO, Student.class)).thenReturn(student);
        when(studentRepository.save(any(Student.class))).thenReturn(student);
        when(modelMapper.map(student, StudentDTO.class)).thenReturn(studentDTO);

        StudentDTO result = studentService.create(studentDTO);

        assertNotNull(result);
        assertEquals(studentDTO.getEmail(), result.getEmail());
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void create_WhenEmailExists_ShouldThrowException() {
        when(studentRepository.existsByEmail(studentDTO.getEmail())).thenReturn(true);

        assertThrows(ResponseStatusException.class, () -> studentService.create(studentDTO));
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void getById_WhenStudentExists_ShouldReturnStudent() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(modelMapper.map(student, StudentDTO.class)).thenReturn(studentDTO);

        Optional<StudentDTO> result = studentService.getById(1L);

        assertTrue(result.isPresent());
        assertEquals(studentDTO.getEmail(), result.get().getEmail());
    }

    @Test
    void getById_WhenStudentDoesNotExist_ShouldReturnEmpty() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<StudentDTO> result = studentService.getById(1L);

        assertTrue(result.isEmpty());
    }

    @Test
    void getAll_ShouldReturnAllStudents() {
        List<Student> students = Arrays.asList(student);
        when(studentRepository.findAll()).thenReturn(students);
        when(modelMapper.map(student, StudentDTO.class)).thenReturn(studentDTO);

        List<StudentDTO> result = studentService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(studentDTO.getEmail(), result.get(0).getEmail());
    }

    @Test
    void update_WhenStudentExists_ShouldUpdateStudent() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(studentRepository.save(any(Student.class))).thenReturn(student);
        when(modelMapper.map(student, StudentDTO.class)).thenReturn(studentDTO);

        StudentDTO result = studentService.update(1L, studentDTO);

        assertNotNull(result);
        assertEquals(studentDTO.getEmail(), result.getEmail());
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void update_WhenStudentDoesNotExist_ShouldThrowException() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> studentService.update(1L, studentDTO));
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void delete_ShouldDeleteStudent() {
        doNothing().when(studentRepository).deleteById(1L);

        studentService.delete(1L);

        verify(studentRepository).deleteById(1L);
    }

    @Test
    void approveUser_WhenStudentExists_ShouldApproveStudent() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        boolean result = studentService.approveUser(1L);

        assertTrue(result);
        assertTrue(student.getApproved());
        verify(studentRepository).save(student);
    }

    @Test
    void approveUser_WhenStudentDoesNotExist_ShouldReturnFalse() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        boolean result = studentService.approveUser(1L);

        assertFalse(result);
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void findByEmail_WhenStudentExists_ShouldReturnStudent() {
        when(studentRepository.findByEmail("test@example.com")).thenReturn(Optional.of(student));

        Student result = (Student) studentService.findByEmail("test@example.com");

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void findByEmail_WhenStudentDoesNotExist_ShouldThrowException() {
        when(studentRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> studentService.findByEmail("test@example.com"));
    }

    @Test
    void existsByEmail_ShouldReturnTrueWhenEmailExists() {
        when(studentRepository.existsByEmail("test@example.com")).thenReturn(true);

        boolean result = studentService.existsByEmail("test@example.com");

        assertTrue(result);
    }

    @Test
    void existsByEmail_ShouldReturnFalseWhenEmailDoesNotExist() {
        when(studentRepository.existsByEmail("test@example.com")).thenReturn(false);

        boolean result = studentService.existsByEmail("test@example.com");

        assertFalse(result);
    }
} 