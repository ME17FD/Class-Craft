package com.ClassCraft.site.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ClassCraft.site.dto.StudentDTO;
import com.ClassCraft.site.dto.UserDTO;
import com.ClassCraft.site.models.Student;
import com.ClassCraft.site.models.User;
import com.ClassCraft.site.repository.StudentRepository;
import com.ClassCraft.site.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements UserService<StudentDTO> {

    private final StudentRepository studentRepository;
    private final ModelMapper modelMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public StudentDTO create(StudentDTO dto) {
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        // Encode the password before saving
        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        dto.setPassword(encodedPassword);

        Student student = modelMapper.map(dto, Student.class);
        student.setApproved(false);
        Student savedStudent = studentRepository.save(student);
        return modelMapper.map(savedStudent, StudentDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<StudentDTO> getById(Long id) {
        return studentRepository.findById(id)
                .map(student -> modelMapper.map(student, StudentDTO.class));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getAll() {
        return studentRepository.findAll().stream()
                .map(student -> modelMapper.map(student, StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentDTO update(Long id, StudentDTO dto) {
        return studentRepository.findById(id)
                .map(existingStudent -> {
                    modelMapper.map(dto, existingStudent);
                    Student updatedStudent = studentRepository.save(existingStudent);
                    return modelMapper.map(updatedStudent, StudentDTO.class);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        studentRepository.deleteById(id);
    }

    @Override
    @Transactional
    public boolean approveUser(Long id) {
        return studentRepository.findById(id)
                .map(student -> {
                    student.setApproved(true);
                    studentRepository.save(student);
                    return true;
                })
                .orElse(false);
    }

    @Override
    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
    }

    @Override
    public UserDTO convertToDTO(User user) {
        if (user instanceof Student student) {
            return modelMapper.map(student, StudentDTO.class);
        }
        throw new IllegalArgumentException("Unexpected user type");
    }
    @Override
    public boolean existsByEmail(String email) {
        // Custom implementation of existsByEmail
        return studentRepository.existsByEmail(email);
    }
}
