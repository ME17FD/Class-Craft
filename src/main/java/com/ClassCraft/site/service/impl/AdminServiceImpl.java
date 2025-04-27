package com.ClassCraft.site.service.impl;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ClassCraft.site.dto.AdminDTO;
import com.ClassCraft.site.dto.UserDTO;
import com.ClassCraft.site.models.Admin;
import com.ClassCraft.site.models.User;
import com.ClassCraft.site.repository.AdminRepository;
import com.ClassCraft.site.service.UserService;


@Service
@Transactional
public class AdminServiceImpl implements UserService<AdminDTO> {

    private final AdminRepository adminRepository;
    private final ModelMapper modelMapper;

    public AdminServiceImpl(AdminRepository adminRepository, ModelMapper modelMapper) {
        this.adminRepository = adminRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public AdminDTO create(AdminDTO dto) {
        // Ensure no email duplication in the system
        if (adminRepository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        Admin admin = modelMapper.map(dto, Admin.class);
        Admin savedAdmin = adminRepository.save(admin);
        return modelMapper.map(savedAdmin, AdminDTO.class);
    }

    @Override
    public Optional<AdminDTO> getById(Long id) {
        return adminRepository.findById(id)
                .map(admin -> modelMapper.map(admin, AdminDTO.class));
    }

    @Override
    public List<AdminDTO> getAll() {
        return adminRepository.findAll().stream()
                .map(admin -> modelMapper.map(admin, AdminDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByEmail(String email) {
        // Custom implementation of existsByEmail
        return adminRepository.existsByEmail(email);
    }

    @Override
    public AdminDTO update(Long id, AdminDTO dto) {
        return adminRepository.findById(id)
                .map(existingAdmin -> {
                    modelMapper.map(dto, existingAdmin);
                    Admin updatedAdmin = adminRepository.save(existingAdmin);
                    return modelMapper.map(updatedAdmin, AdminDTO.class);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));
    }

    @Override
    public void delete(Long id) {
        adminRepository.deleteById(id);
    }

    @Override
    public boolean approveUser(Long id) {
        return adminRepository.findById(id)
                .map(admin -> {
                    // Approval logic (if needed)
                    admin.setApproved(true);
                    adminRepository.save(admin);
                    return true;
                })
                .orElse(false);
    }

    @Override
    public User findByEmail(String email) {
        return adminRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));
    }

    @Override
    public UserDTO convertToDTO(User user) {
        if (user instanceof Admin admin) {
            return modelMapper.map(admin, AdminDTO.class);
        }
        throw new IllegalArgumentException("Unexpected user type");
    }

    
}
