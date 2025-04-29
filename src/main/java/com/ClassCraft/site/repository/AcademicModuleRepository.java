package com.ClassCraft.site.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Module;

@Repository
public interface AcademicModuleRepository  extends JpaRepository<Module, Long> {
    // You can define custom query methods here if needed
    // For example, finding a Module by its code:
    Module findByCode(String code);
}