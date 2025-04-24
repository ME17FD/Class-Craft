package com.ClassCraft.site.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Boolean wasAttended = false;
    
    @ManyToOne
    private SubModule subModule;
    
    @ManyToOne
    private Group group;
    
    @ManyToOne
    private Classroom classroom;
}
