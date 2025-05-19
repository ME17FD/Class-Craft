package com.ClassCraft.site.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import com.ClassCraft.site.service.impl.AdminServiceImpl;
import com.ClassCraft.site.service.impl.ProfessorServiceImpl;
import com.ClassCraft.site.service.impl.StudentServiceImpl;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private AdminServiceImpl adminService;

    @Autowired
    private ProfessorServiceImpl professorService;

    @Autowired
    private StudentServiceImpl studentService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtProvider.generateToken(authentication);
            
            // Find user based on their role
            User user;
            String role ;

            // Determine user type and find user with respective service
            if (adminService.existsByEmail(loginDTO.getEmail())) {
                user = adminService.findByEmail(loginDTO.getEmail());
                role = "ADMIN";
            } else if (professorService.existsByEmail(loginDTO.getEmail())) {
                user = professorService.findByEmail(loginDTO.getEmail());
                role = "PROFESSOR";
            } else if (studentService.existsByEmail(loginDTO.getEmail())) {
                user = studentService.findByEmail(loginDTO.getEmail());
                role = "STUDENT";
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found!");
            }
            System.out.println(role);

            UserDTO userDTO = null;
            if (role.equals("ADMIN")) {
                userDTO = adminService.convertToDTO((Admin) user);
            } else if (role.equals("PROFESSOR")) {
                userDTO = professorService.convertToDTO((Professor) user);
            } else if (role.equals("STUDENT")) {
                userDTO = studentService.convertToDTO((Student) user);
            }

            // Prepare the response
            AuthResponseDTO response = new AuthResponseDTO();
            response.setToken(jwt);
            response.setRole(role);
            response.setUserDetails(userDTO);

            // Friendly success message
            

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Handle errors and provide a more friendly message
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Login failed! Please check your credentials and try again.");
            //e.printStackTrace();
            System.out.println("AuthController: Login failed! Please check your credentials and try again.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<StudentDTO> register(@RequestBody StudentDTO studentDTO) {
        StudentDTO student = studentService.create(studentDTO);
        return ResponseEntity.ok(student);
    }
}
