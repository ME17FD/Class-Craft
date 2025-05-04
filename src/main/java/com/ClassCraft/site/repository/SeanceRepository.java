package com.ClassCraft.site.repository;


import com.ClassCraft.site.controller.SeanceController;
import com.ClassCraft.site.models.Group;
import com.ClassCraft.site.models.Sceance;

import java.sql.Time;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SeanceRepository extends JpaRepository<Sceance, Long> {
    
    // Trouver une séance par son jour de la semaine et son groupe
    List<Sceance> findByDayOfWeekAndGroupId(String dayOfWeek, Long groupId);

    // Trouver toutes les séances pour un sous-module
    List<Sceance> findBySubModuleId(Long subModuleId);

    // Trouver toutes les séances par leur fréquence
    List<Sceance> findByFrequency(String frequency);

    // Vérifier si une séance a été suivie (boolean)
    List<Sceance> findByWasAttended(Boolean wasAttended);

    // Trouver une séance par son ID (si tu veux personnaliser la méthode)
    @Override
    Optional<Sceance> findById(Long id);
    
    // Trouver toutes les séances pour une salle donnée
    List<Sceance> findByClassroomId(Long classroomId);

    // Trouver toutes les séances dans une plage horaire spécifique
    List<Sceance> findByStartTimeBetween(Time startTime, Time endTime);

    //Trouver toute les séancess par group
    List<Sceance> findByGroupId(Long groupId);
}
