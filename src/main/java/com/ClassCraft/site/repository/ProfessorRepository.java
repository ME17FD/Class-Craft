package com.ClassCraft.site.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Professor;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    List<Professor> findBySpecialty(String specialty);
}