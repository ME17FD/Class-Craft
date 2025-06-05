package com.ClassCraft.site.models;

import java.sql.Time;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonFormat;

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
    public enum SceanceType {
        CM, TD, TP
    }
    private String dayOfWeek;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private Time startTime;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private Time endTime;

    private int frequency;
    private SceanceType type;
    private Boolean wasAttended = false;
    


    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private SubModule subModule;
     
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Module module;
    
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Group group;
    
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Classroom classroom;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Professor professor;


  
}
