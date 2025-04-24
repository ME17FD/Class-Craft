package com.ClassCraft.site.service.impl;

import com.ClassCraft.site.dto.AuthResponseDTO;
import com.ClassCraft.site.dto.LoginDTO;
import com.ClassCraft.site.dto.UserDTO;
import com.ClassCraft.site.models.*;
import com.ClassCraft.site.repository.UserRepository;
import com.ClassCraft.site.security.JwtProvider;
import com.ClassCraft.site.service.AuthService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private UserRepository<? extends User> userRepository;  // Handle the generic UserRepository

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public AuthResponseDTO login(LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );

        // Since the repository is generic, we need to cast to User
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Generate the JWT token
        String token = jwtProvider.generateToken(authentication);

        // Create AuthResponseDTO
        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(token);

        // Determine role based on the instance type
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
}
