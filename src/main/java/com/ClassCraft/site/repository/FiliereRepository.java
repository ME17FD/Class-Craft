package com.ClassCraft.site.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Filiere;

@Repository
public interface FiliereRepository extends JpaRepository<Filiere, Long> {
}
