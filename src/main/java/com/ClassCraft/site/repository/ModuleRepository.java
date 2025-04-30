package com.ClassCraft.site.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Module;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
}