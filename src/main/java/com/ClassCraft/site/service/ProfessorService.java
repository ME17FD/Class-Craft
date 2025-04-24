package com.ClassCraft.site.service;

import java.util.List;

import com.ClassCraft.site.dto.ProfessorDTO;

public interface ProfessorService extends UserService<ProfessorDTO> {
    List<ProfessorDTO> getProfessorsBySpecialty(String specialty);
}