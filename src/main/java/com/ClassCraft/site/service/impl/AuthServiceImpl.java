package com.ClassCraft.site.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ClassCraft.site.dto.AuthResponseDTO;
import com.ClassCraft.site.dto.LoginDTO;
import com.ClassCraft.site.dto.UserDTO;
import com.ClassCraft.site.models.Admin;
import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.models.Student;
import com.ClassCraft.site.models.User;
import com.ClassCraft.site.repository.AdminRepository;
import com.ClassCraft.site.repository.ProfessorRepository;
import com.ClassCraft.site.repository.StudentRepository;
import com.ClassCraft.site.security.JwtProvider;
import com.ClassCraft.site.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private ProfessorRepository professorRepository;
    
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public AuthResponseDTO login(LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );

        // Dynamically determine the repository to use based on the email
        User user = findUserByEmail(loginDTO.getEmail());

        // Generate the JWT token
        String token = jwtProvider.generateToken(authentication);

        // Create AuthResponseDTO
        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(token);

        // Set the role dynamically based on user type
        if (user instanceof Professor) {
            response.setRole("ROLE_PROFESSOR");
        } else if (user instanceof Student) {
            response.setRole("ROLE_STUDENT");
        } else if (user instanceof Admin) {
            response.setRole("ROLE_ADMIN");
        } else {
            response.setRole("ROLE_USER"); // Default role, if needed
        }

        response.setUserDetails(modelMapper.map(user, UserDTO.class));

        return response;
    }

    // Helper method to find the user based on the email
    private User findUserByEmail(String email) {
        // Check the repositories one by one
        User user = adminRepository.findByEmail(email).orElse(null);
        if (user != null) {
            return user;
        }

        user = professorRepository.findByEmail(email).orElse(null);
        if (user != null) {
            return user;
        }

        user = studentRepository.findByEmail(email).orElse(null);
        if (user != null) {
            return user;
        }

        throw new UsernameNotFoundException("User not found");
    }
}
