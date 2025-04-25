package com.ClassCraft.site.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    

}