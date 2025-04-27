package com.ClassCraft.site.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ClassCraft.site.models.Admin;
import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.models.Student;
import com.ClassCraft.site.models.User;
import com.ClassCraft.site.repository.StudentRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final StudentRepository studentRepository;

    public CustomUserDetailsService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // In your case, you might need to modify this to check other repositories
        // for Professor and Admin if they're in separate tables
        User user = studentRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

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
        if (user instanceof Student) {
            return ((Student) user).getApproved();
        }
        // For Admin and Professor, you might have different approval logic
        return true; // Default to true if no approval needed
    }

    private boolean isAccountLocked(User user) {
        // Implement your account locking logic if needed
        return false; // Default to not locked
    }
}