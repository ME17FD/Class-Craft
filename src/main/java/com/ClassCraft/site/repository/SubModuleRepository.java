package com.ClassCraft.site.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.models.SubModule;

@Repository
public interface SubModuleRepository extends JpaRepository<SubModule, Long> {
    SubModule findByName(String name);
    List<SubModule> findByTeacher(Professor professor);
}
