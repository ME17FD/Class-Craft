package com.ClassCraft.site.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.ClassCraft.site.dto.ReservationDTO;

public interface ReservationService {
    ReservationDTO create(ReservationDTO reservationDTO);
    Optional<ReservationDTO> getById(Long id);
    List<ReservationDTO> getAll();
    ReservationDTO update(Long id, ReservationDTO reservationDTO);
    void delete(Long id);
    
    // Reservation-specific methods
    List<ReservationDTO> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    List<ReservationDTO> findByClassroomId(Long classroomId);
    List<ReservationDTO> findByGroupId(Long groupId);
    List<ReservationDTO> findBySubModuleId(Long subModuleId);
    boolean isTimeSlotAvailable(Long classroomId, LocalDateTime startDateTime, LocalDateTime endDateTime);
    void markAsAttended(Long id);
} 