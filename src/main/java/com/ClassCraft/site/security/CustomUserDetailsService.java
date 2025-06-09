package com.ClassCraft.site.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.ClassCraft.site.models.Admin;
import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.models.Student;
import com.ClassCraft.site.models.User;
import com.ClassCraft.site.repository.AdminRepository;
import com.ClassCraft.site.repository.ProfessorRepository;
import com.ClassCraft.site.repository.StudentRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final AdminRepository adminRepository;

    public CustomUserDetailsService(StudentRepository studentRepository,
            ProfessorRepository professorRepository,
            AdminRepository adminRepository) {
        this.studentRepository = studentRepository;
        this.professorRepository = professorRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        User user;

        // Search in StudentRepository
        user = studentRepository.findByEmail(email).orElse(null);

        // If not found, search in ProfessorRepository
        if (user == null) {
            user = professorRepository.findByEmail(email).orElse(null);
        }

        // If still not found, search in AdminRepository
        if (user == null) {
            user = adminRepository.findByEmail(email).orElse(null);
        }

        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        String role = determineUserRole(user);

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(role)
                .accountLocked(isAccountLocked(user))
                .disabled(!isAccountEnabled(user))
                .build();
    }

    private String determineUserRole(User user) {
        if (user instanceof Admin) {
            return "ADMIN";
        } else if (user instanceof Professor) {
            return "PROFESSOR";
        } else if (user instanceof Student) {
            return "STUDENT";
        }
        return "USER";
    }

    private boolean isAccountEnabled(User user) {
        if (user instanceof Student student) {
            return student.getApproved();
        }
        if (user instanceof Professor professor) {
            return professor.getApproved();
        }
        // For Admin you might have different approval logic
        return true; // Default to true if no approval needed
    }

    private boolean isAccountLocked(User user) {
        // Implement your account locking logic if needed
        return false; // Default to not locked
    }
}
