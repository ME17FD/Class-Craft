package com.ClassCraft.site.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    Session findByName(String name);
    Boolean existsByName(String name);
}
