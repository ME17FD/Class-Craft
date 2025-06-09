package com.ClassCraft.site.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
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
import com.ClassCraft.site.service.impl.ReservationServiceImpl;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private ClassroomRepository classroomRepository;

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private SubModuleRepository subModuleRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private ReservationServiceImpl reservationService;

    private ReservationDTO reservationDTO;
    private Reservation reservation;
    private Classroom classroom;
    private Group group;
    private SubModule subModule;

    @BeforeEach
    void setUp() {
        // Setup test data
        classroom = new Classroom();
        classroom.setId(1L);
        classroom.setName("Room 101");

        group = new Group();
        group.setId(1L);
        group.setName("Group A");

        subModule = new SubModule();
        subModule.setId(1L);
        subModule.setName("SubModule 1");

        reservation = new Reservation();
        reservation.setId(1L);
        reservation.setStartDateTime(LocalDateTime.now().plusDays(1));
        reservation.setEndDateTime(LocalDateTime.now().plusDays(1).plusHours(2));
        reservation.setClassroom(classroom);
        reservation.setGroup(group);
        reservation.setSubModule(subModule);
        reservation.setType(Reservation.ReservationType.CM);
        reservation.setWasAttended(false);

        reservationDTO = new ReservationDTO();
        reservationDTO.setId(1L);
        reservationDTO.setStartDateTime(LocalDateTime.now().plusDays(1));
        reservationDTO.setEndDateTime(LocalDateTime.now().plusDays(1).plusHours(2));
        reservationDTO.setClassroomId(1L);
        reservationDTO.setGroupId(1L);
        reservationDTO.setSubModuleId(1L);
        reservationDTO.setType("CM");
        reservationDTO.setWasAttended(false);
    }

    @Test
    void create_ValidReservation_ShouldCreateSuccessfully() {
        // Arrange
        when(classroomRepository.findById(1L)).thenReturn(Optional.of(classroom));
        when(groupRepository.findById(1L)).thenReturn(Optional.of(group));
        when(subModuleRepository.findById(1L)).thenReturn(Optional.of(subModule));
        when(reservationRepository.findOverlappingReservations(any(), any(), any())).thenReturn(List.of());
        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);
        when(modelMapper.map(any(Reservation.class), eq(ReservationDTO.class))).thenReturn(reservationDTO);

        // Act
        ReservationDTO result = reservationService.create(reservationDTO);

        // Assert
        assertNotNull(result);
        assertEquals(reservationDTO.getId(), result.getId());
        verify(reservationRepository).save(any(Reservation.class));
    }

    @Test
    void create_OverlappingReservation_ShouldThrowException() {
        // Arrange
        when(reservationRepository.findOverlappingReservations(any(), any(), any())).thenReturn(List.of(reservation));

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, 
            () -> reservationService.create(reservationDTO));
        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        assertEquals("Time slot is not available", exception.getReason());
    }

    @Test
    void getById_ExistingReservation_ShouldReturnReservation() {
        // Arrange
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(modelMapper.map(reservation, ReservationDTO.class)).thenReturn(reservationDTO);

        // Act
        Optional<ReservationDTO> result = reservationService.getById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(reservationDTO.getId(), result.get().getId());
    }

    @Test
    void getById_NonExistingReservation_ShouldReturnEmpty() {
        // Arrange
        when(reservationRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        Optional<ReservationDTO> result = reservationService.getById(1L);

        // Assert
        assertTrue(result.isEmpty());
    }

    @Test
    void getAll_ShouldReturnAllReservations() {
        // Arrange
        List<Reservation> reservations = Arrays.asList(reservation);
        when(reservationRepository.findAll()).thenReturn(reservations);
        when(modelMapper.map(reservation, ReservationDTO.class)).thenReturn(reservationDTO);

        // Act
        List<ReservationDTO> result = reservationService.getAll();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(reservationDTO.getId(), result.get(0).getId());
    }

    @Test
    void update_ValidReservation_ShouldUpdateSuccessfully() {
        // Arrange
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(classroomRepository.findById(1L)).thenReturn(Optional.of(classroom));
        when(groupRepository.findById(1L)).thenReturn(Optional.of(group));
        when(subModuleRepository.findById(1L)).thenReturn(Optional.of(subModule));
        when(reservationRepository.findOverlappingReservations(any(), any(), any())).thenReturn(List.of());
        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);
        when(modelMapper.map(any(Reservation.class), eq(ReservationDTO.class))).thenReturn(reservationDTO);

        // Act
        ReservationDTO result = reservationService.update(1L, reservationDTO);

        // Assert
        assertNotNull(result);
        assertEquals(reservationDTO.getId(), result.getId());
        verify(reservationRepository).save(any(Reservation.class));
    }

    @Test
    void delete_ExistingReservation_ShouldDeleteSuccessfully() {
        // Act
        reservationService.delete(1L);

        // Assert
        verify(reservationRepository).deleteById(1L);
    }

    @Test
    void findByDateRange_ShouldReturnReservationsInRange() {
        // Arrange
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = LocalDateTime.now().plusDays(7);
        List<Reservation> reservations = Arrays.asList(reservation);
        when(reservationRepository.findByStartDateTimeBetween(startDate, endDate)).thenReturn(reservations);
        when(modelMapper.map(reservation, ReservationDTO.class)).thenReturn(reservationDTO);

        // Act
        List<ReservationDTO> result = reservationService.findByDateRange(startDate, endDate);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(reservationDTO.getId(), result.get(0).getId());
    }

    @Test
    void markAsAttended_ExistingReservation_ShouldMarkSuccessfully() {
        // Arrange
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);

        // Act
        reservationService.markAsAttended(1L);

        // Assert
        assertTrue(reservation.getWasAttended());
        verify(reservationRepository).save(reservation);
    }

    @Test
    void markAsAttended_NonExistingReservation_ShouldThrowException() {
        // Arrange
        when(reservationRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> reservationService.markAsAttended(1L));
    }
} 