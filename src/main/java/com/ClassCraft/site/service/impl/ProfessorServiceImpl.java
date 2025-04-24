package com.ClassCraft.site.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ClassCraft.site.dto.ProfessorDTO;
import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.repository.ProfessorRepository;
import com.ClassCraft.site.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfessorServiceImpl implements UserService<ProfessorDTO> {
    
    private final ProfessorRepository professorRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public ProfessorDTO create(ProfessorDTO dto) {
        if (professorRepository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        
        Professor professor = modelMapper.map(dto, Professor.class);
        professor.setApproved(false);
        Professor savedProfessor = professorRepository.save(professor);
        return modelMapper.map(savedProfessor, ProfessorDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProfessorDTO> getById(Long id) {
        return professorRepository.findById(id)
                .map(professor -> modelMapper.map(professor, ProfessorDTO.class));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProfessorDTO> getAll() {
        return professorRepository.findAll().stream()
                .map(professor -> modelMapper.map(professor, ProfessorDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProfessorDTO update(Long id, ProfessorDTO dto) {
        return professorRepository.findById(id)
                .map(existingProfessor -> {
                    modelMapper.map(dto, existingProfessor);
                    Professor updatedProfessor = professorRepository.save(existingProfessor);
                    return modelMapper.map(updatedProfessor, ProfessorDTO.class);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor not found"));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        professorRepository.deleteById(id);
    }

    @Override
    @Transactional
    public boolean approveUser(Long id) {
        return professorRepository.findById(id)
                .map(professor -> {
                    professor.setApproved(true);
                    professorRepository.save(professor);
                    return true;
                })
                .orElse(false);
    }

    // Professor-specific methods
    @Transactional(readOnly = true)
    public List<ProfessorDTO> findBySpecialty(String specialty) {
        return professorRepository.findBySpecialty(specialty).stream()
                .map(professor -> modelMapper.map(professor, ProfessorDTO.class))
                .collect(Collectors.toList());
    }
}