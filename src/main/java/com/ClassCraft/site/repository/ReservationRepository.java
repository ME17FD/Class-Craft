package com.ClassCraft.site.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    @Query("SELECT r FROM Reservation r WHERE " +
           "r.classroom.id = :classroomId AND " +
           "((r.startDateTime <= :end AND r.endDateTime >= :start))")
    List<Reservation> findConflictingReservations(
        Long classroomId, 
        LocalDateTime start, 
        LocalDateTime end
    );

    boolean existsByClassroomIdAndStartDateTimeLessThanEqualAndEndDateTimeGreaterThanEqual(
        Long classroomId, 
        LocalDateTime end, 
        LocalDateTime start
    );
}