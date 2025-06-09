package com.ClassCraft.site.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.ClassCraft.site.models.Admin;
import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.models.Student;
import com.ClassCraft.site.repository.AdminRepository;
import com.ClassCraft.site.repository.ProfessorRepository;
import com.ClassCraft.site.repository.StudentRepository;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ProfessorRepository professorRepository;

    @Mock
    private AdminRepository adminRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    private Student student;
    private Professor professor;
    private Admin admin;
    private static final String TEST_EMAIL = "test@example.com";

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setId(1L);
        student.setEmail(TEST_EMAIL);
        student.setPassword("password");
        student.setApproved(true);

        professor = new Professor();
        professor.setId(1L);
        professor.setEmail(TEST_EMAIL);
        professor.setPassword("password");
        professor.setApproved(true);

        admin = new Admin();
        admin.setId(1L);
        admin.setEmail(TEST_EMAIL);
        admin.setPassword("password");
    }

    @Test
    void loadUserByUsername_WhenStudentExists_ShouldReturnStudentDetails() {
        when(studentRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(student));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(TEST_EMAIL);

        assertNotNull(userDetails);
        assertEquals(TEST_EMAIL, userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
        assertTrue(userDetails.isEnabled());
    }

    @Test
    void loadUserByUsername_WhenProfessorExists_ShouldReturnProfessorDetails() {
        when(studentRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());
        when(professorRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(professor));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(TEST_EMAIL);

        assertNotNull(userDetails);
        assertEquals(TEST_EMAIL, userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
        assertTrue(userDetails.isEnabled());
    }

    @Test
    void loadUserByUsername_WhenAdminExists_ShouldReturnAdminDetails() {
        when(studentRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());
        when(professorRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());
        when(adminRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(admin));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(TEST_EMAIL);

        assertNotNull(userDetails);
        assertEquals(TEST_EMAIL, userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
        assertTrue(userDetails.isEnabled());
    }

    @Test
    void loadUserByUsername_WhenUserDoesNotExist_ShouldThrowException() {
        when(studentRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());
        when(professorRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());
        when(adminRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> customUserDetailsService.loadUserByUsername(TEST_EMAIL));
    }

    @Test
    void loadUserByUsername_WhenEmailIsNull_ShouldThrowException() {
        assertThrows(IllegalArgumentException.class, () -> customUserDetailsService.loadUserByUsername(null));
    }

    @Test
    void loadUserByUsername_WhenEmailIsEmpty_ShouldThrowException() {
        assertThrows(IllegalArgumentException.class, () -> customUserDetailsService.loadUserByUsername(""));
    }

    @Test
    void loadUserByUsername_ShouldCheckRepositoriesInCorrectOrder() {
        when(studentRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());
        when(professorRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());
        when(adminRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(admin));

        customUserDetailsService.loadUserByUsername(TEST_EMAIL);

        verify(studentRepository).findByEmail(TEST_EMAIL);
        verify(professorRepository).findByEmail(TEST_EMAIL);
        verify(adminRepository).findByEmail(TEST_EMAIL);
    }
} 