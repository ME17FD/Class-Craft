package com.ClassCraft.site.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ClassCraft.site.dto.AuthResponseDTO;
import com.ClassCraft.site.dto.LoginDTO;
import com.ClassCraft.site.dto.StudentDTO;
import com.ClassCraft.site.dto.UserDTO;
import com.ClassCraft.site.models.Admin;
import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.models.Student;
import com.ClassCraft.site.models.User;
import com.ClassCraft.site.security.JwtProvider;
import com.ClassCraft.site.service.impl.StudentServiceImpl;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private StudentServiceImpl studentService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication);
        User user = studentService.findByEmail(loginDTO.getEmail());  // fallback to studentService
        UserDTO userDTO = studentService.convertToDTO(user);

        String role = user instanceof Admin ? "ADMIN" :
                      user instanceof Professor ? "PROFESSOR" :
                      user instanceof Student ? "STUDENT" : "USER";

        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(jwt);
        response.setRole(role);
        response.setUserDetails(userDTO);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<StudentDTO> register(@RequestBody StudentDTO studentDTO) {
        StudentDTO student = studentService.create(studentDTO);
        return ResponseEntity.ok(student);
    }
}
