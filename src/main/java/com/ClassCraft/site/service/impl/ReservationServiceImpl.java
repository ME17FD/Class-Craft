package com.ClassCraft.site.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ClassCraft.site.dto.ReservationDTO;
import com.ClassCraft.site.models.Classroom;
import com.ClassCraft.site.models.Group;
import com.ClassCraft.site.models.Reservation;
import com.ClassCraft.site.models.SubModule;
import com.ClassCraft.site.repository.ClassroomRepository;
import com.ClassCraft.site.repository.GroupRepository;
import com.ClassCraft.site.repository.ReservationRepository;
import com.ClassCraft.site.repository.SubModuleRepository;
import com.ClassCraft.site.service.ReservationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final ClassroomRepository classroomRepository;
    private final GroupRepository groupRepository;
    private final SubModuleRepository subModuleRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public ReservationDTO create(ReservationDTO reservationDTO) {
        validateReservation(reservationDTO);
        
        if (!isTimeSlotAvailable(reservationDTO.getClassroomId(), 
                               reservationDTO.getStartDateTime(), 
                               reservationDTO.getEndDateTime())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Time slot is not available");
        }

        Reservation reservation = new Reservation();
        mapToEntity(reservationDTO, reservation);
        Reservation savedReservation = reservationRepository.save(reservation);
        return modelMapper.map(savedReservation, ReservationDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ReservationDTO> getById(Long id) {
        return reservationRepository.findById(id)
                .map(reservation -> modelMapper.map(reservation, ReservationDTO.class));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationDTO> getAll() {
        return reservationRepository.findAll().stream()
                .map(reservation -> modelMapper.map(reservation, ReservationDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReservationDTO update(Long id, ReservationDTO reservationDTO) {
        return reservationRepository.findById(id)
                .map(existingReservation -> {
                    validateReservation(reservationDTO);
                    
                    // Check if the new time slot is available (excluding current reservation)
                    if (!isTimeSlotAvailable(reservationDTO.getClassroomId(),
                                           reservationDTO.getStartDateTime(),
                                           reservationDTO.getEndDateTime(),
                                           id)) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Time slot is not available");
                    }
                    
                    mapToEntity(reservationDTO, existingReservation);
                    Reservation updatedReservation = reservationRepository.save(existingReservation);
                    return modelMapper.map(updatedReservation, ReservationDTO.class);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        reservationRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationDTO> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return reservationRepository.findByStartDateTimeBetween(startDate, endDate).stream()
                .map(reservation -> modelMapper.map(reservation, ReservationDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationDTO> findByClassroomId(Long classroomId) {
        return reservationRepository.findByClassroomId(classroomId).stream()
                .map(reservation -> modelMapper.map(reservation, ReservationDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationDTO> findByGroupId(Long groupId) {
        return reservationRepository.findByGroupId(groupId).stream()
                .map(reservation -> modelMapper.map(reservation, ReservationDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationDTO> findBySubModuleId(Long subModuleId) {
        return reservationRepository.findBySubModuleId(subModuleId).stream()
                .map(reservation -> modelMapper.map(reservation, ReservationDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isTimeSlotAvailable(Long classroomId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        return isTimeSlotAvailable(classroomId, startDateTime, endDateTime, null);
    }

    @Override
    @Transactional
    public void markAsAttended(Long id) {
        reservationRepository.findById(id)
                .map(reservation -> {
                    reservation.setWasAttended(true);
                    return reservationRepository.save(reservation);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));
    }

    private boolean isTimeSlotAvailable(Long classroomId, LocalDateTime startDateTime, LocalDateTime endDateTime, Long excludeReservationId) {
        List<Reservation> conflictingReservations = reservationRepository
                .findOverlappingReservations(classroomId, startDateTime, endDateTime);

        if (excludeReservationId != null) {
            conflictingReservations = conflictingReservations.stream()
                    .filter(r -> !r.getId().equals(excludeReservationId))
                    .collect(Collectors.toList());
        }

        return conflictingReservations.isEmpty();
    }

    private void validateReservation(ReservationDTO reservationDTO) {
        if (reservationDTO.getStartDateTime().isAfter(reservationDTO.getEndDateTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start time must be before end time");
        }

        if (reservationDTO.getStartDateTime().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot create reservations in the past");
        }

        if (reservationDTO.getType() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reservation type is required");
        }

        try {
            Reservation.ReservationType.valueOf(reservationDTO.getType());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reservation type: " + reservationDTO.getType());
        }
    }

    private void mapToEntity(ReservationDTO dto, Reservation entity) {
        entity.setStartDateTime(dto.getStartDateTime());
        entity.setEndDateTime(dto.getEndDateTime());
        entity.setWasAttended(dto.getWasAttended());
        entity.setType(Reservation.ReservationType.valueOf(dto.getType()));

        Classroom classroom = classroomRepository.findById(dto.getClassroomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Classroom not found"));
        entity.setClassroom(classroom);

        Group group = groupRepository.findById(dto.getGroupId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));
        entity.setGroup(group);

        SubModule subModule = subModuleRepository.findById(dto.getSubModuleId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "SubModule not found"));
        entity.setSubModule(subModule);
    }
} 