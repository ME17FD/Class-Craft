package com.ClassCraft.site.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByStartDateTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Reservation> findByClassroomId(Long classroomId);
    List<Reservation> findByGroupId(Long groupId);
    List<Reservation> findBySubModuleId(Long subModuleId);
    
    @Query(value = "SELECT * FROM reservation r WHERE " +
    "r.classroom_id = :classroomId AND " +
    "r.start_date_time < :endDateTime AND " +
    "r.end_date_time > :startDateTime", 
    nativeQuery = true)
List<Reservation> findOverlappingReservations(
 @Param("classroomId") Long classroomId,
 @Param("startDateTime") LocalDateTime startDateTime,
 @Param("endDateTime") LocalDateTime endDateTime
);
}