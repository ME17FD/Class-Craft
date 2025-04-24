package com.ClassCraft.site.service.impl;


import com.ClassCraft.site.dto.AdminDTO;
import com.ClassCraft.site.models.Admin;
import com.ClassCraft.site.repository.AdminRepository;
import com.ClassCraft.site.service.AdminService;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final ModelMapper modelMapper;

    public AdminServiceImpl(AdminRepository adminRepository, ModelMapper modelMapper) {
        this.adminRepository = adminRepository;
        this.modelMapper = modelMapper;
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
}
