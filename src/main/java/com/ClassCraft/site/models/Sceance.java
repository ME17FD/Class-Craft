package com.ClassCraft.site.models;

import java.sql.Time;

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
public class Sceance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String dayOfWeek;
    private Time startTime;
    private Time endTime;
    private int frequency;

    private Boolean wasAttended = false;
    
    @ManyToOne
    private SubModule subModule;
     
    @ManyToOne
    private Module module;
    
    @ManyToOne
    private Group group;
    
    @ManyToOne
    private Classroom classroom;

    @ManyToOne
    private Professor professor;
}
