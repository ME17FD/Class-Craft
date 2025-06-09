package com.ClassCraft.site.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.ClassCraft.site.dto.StudentDTO;
import com.ClassCraft.site.models.Student;
import com.ClassCraft.site.models.User;
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

        studentDTO = new StudentDTO();
        studentDTO.setId(1L);
        studentDTO.setEmail("test@example.com");
        studentDTO.setPassword("password");

        lenient().when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
    }

    @Test
    void create_WhenEmailDoesNotExist_ShouldCreateStudent() {
        when(studentRepository.existsByEmail(studentDTO.getEmail())).thenReturn(false);
        when(modelMapper.map(eq(studentDTO), eq(Student.class))).thenReturn(student);
        when(studentRepository.save(any(Student.class))).thenReturn(student);
        when(modelMapper.map(eq(student), eq(StudentDTO.class))).thenReturn(studentDTO);

        StudentDTO result = studentService.create(studentDTO);

        assertNotNull(result);
        assertEquals(studentDTO.getEmail(), result.getEmail());
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void create_WhenEmailExists_ShouldThrowException() {
        when(studentRepository.existsByEmail(studentDTO.getEmail())).thenReturn(true);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, 
            () -> studentService.create(studentDTO));
        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        assertEquals("Email already exists", exception.getReason());
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void create_WithNullStudentDTO_ShouldThrowException() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, 
            () -> studentService.create(null));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("StudentDTO cannot be null", exception.getReason());
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void create_WithEmptyEmail_ShouldThrowException() {
        studentDTO.setEmail("");
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, 
            () -> studentService.create(studentDTO));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Email cannot be null or empty", exception.getReason());
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void update_WhenStudentExists_ShouldUpdateStudent() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        doAnswer(invocation -> {
            StudentDTO dto = invocation.getArgument(0);
            Student existingStudent = invocation.getArgument(1);
            existingStudent.setEmail(dto.getEmail());
            return null;
        }).when(modelMapper).map(any(StudentDTO.class), any(Student.class));
        when(studentRepository.save(any(Student.class))).thenReturn(student);
        when(modelMapper.map(eq(student), eq(StudentDTO.class))).thenReturn(studentDTO);

        StudentDTO result = studentService.update(1L, studentDTO);

        assertNotNull(result);
        assertEquals(studentDTO.getEmail(), result.getEmail());
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void update_WhenStudentDoesNotExist_ShouldThrowException() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, 
            () -> studentService.update(1L, studentDTO));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Student not found", exception.getReason());
    }

    @Test
    void update_WithNullStudentDTO_ShouldThrowException() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, 
            () -> studentService.update(1L, null));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("StudentDTO cannot be null", exception.getReason());
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void update_WithEmptyEmail_ShouldThrowException() {
        studentDTO.setEmail("");
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, 
            () -> studentService.update(1L, studentDTO));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Email cannot be null or empty", exception.getReason());
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void delete_WhenStudentExists_ShouldDeleteStudent() {
        doNothing().when(studentRepository).deleteById(1L);

        studentService.delete(1L);

        verify(studentRepository).deleteById(1L);
    }

    @Test
    void delete_WhenStudentDoesNotExist_ShouldNotThrowException() {
        doNothing().when(studentRepository).deleteById(1L);

        studentService.delete(1L);

        verify(studentRepository).deleteById(1L);
    }

    @Test
    void getById_WhenStudentExists_ShouldReturnStudent() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(modelMapper.map(eq(student), eq(StudentDTO.class))).thenReturn(studentDTO);

        Optional<StudentDTO> result = studentService.getById(1L);

        assertTrue(result.isPresent());
        assertEquals(studentDTO.getId(), result.get().getId());
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
        List<StudentDTO> studentDTOs = Arrays.asList(studentDTO);

        when(studentRepository.findAll()).thenReturn(students);
        when(modelMapper.map(eq(student), eq(StudentDTO.class))).thenReturn(studentDTO);

        List<StudentDTO> result = studentService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(studentDTO.getEmail(), result.get(0).getEmail());
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

        User result = studentService.findByEmail("test@example.com");

        assertNotNull(result);
        assertTrue(result instanceof Student);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void findByEmail_WhenStudentDoesNotExist_ShouldThrowException() {
        when(studentRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, 
            () -> studentService.findByEmail("test@example.com"));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Student not found", exception.getReason());
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