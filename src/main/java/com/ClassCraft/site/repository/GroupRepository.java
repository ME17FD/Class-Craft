package com.ClassCraft.site.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Group;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByFiliereId(Long filiereId);
    Group findByName(String name);
}