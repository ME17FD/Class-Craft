package com.ClassCraft.site.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ClassCraft.site.dto.ReservationDTO;
import com.ClassCraft.site.service.ReservationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(@RequestBody ReservationDTO reservationDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationService.create(reservationDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationDTO> getReservation(@PathVariable Long id) {
        return reservationService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationDTO> updateReservation(
            @PathVariable Long id,
            @RequestBody ReservationDTO reservationDTO) {
        return ResponseEntity.ok(reservationService.update(id, reservationDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ReservationDTO>> getReservationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(reservationService.findByDateRange(startDate, endDate));
    }

    @GetMapping("/classroom/{classroomId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByClassroom(@PathVariable Long classroomId) {
        return ResponseEntity.ok(reservationService.findByClassroomId(classroomId));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsByGroup(@PathVariable Long groupId) {
        return ResponseEntity.ok(reservationService.findByGroupId(groupId));
    }

    @GetMapping("/submodule/{subModuleId}")
    public ResponseEntity<List<ReservationDTO>> getReservationsBySubModule(@PathVariable Long subModuleId) {
        return ResponseEntity.ok(reservationService.findBySubModuleId(subModuleId));
    }

    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkTimeSlotAvailability(
            @RequestParam Long classroomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDateTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDateTime) {
        return ResponseEntity.ok(reservationService.isTimeSlotAvailable(classroomId, startDateTime, endDateTime));
    }

    @PutMapping("/{id}/mark-attended")
    public ResponseEntity<Void> markReservationAsAttended(@PathVariable Long id) {
        reservationService.markAsAttended(id);
        return ResponseEntity.ok().build();
    }
} 