package com.ClassCraft.site.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.SubModule;

@Repository
public interface SubModuleRepository extends JpaRepository<SubModule, Long> {
    SubModule findByName(String name);
}
