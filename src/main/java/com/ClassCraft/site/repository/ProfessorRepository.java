package com.ClassCraft.site.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Professor;

@Repository
public interface ProfessorRepository extends UserRepository<Professor> {
    List<Professor> findBySpecialty(String specialty);
}