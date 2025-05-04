package com.ClassCraft.site.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private Integer capacity;
    private ClassroomType type;  // Enum pour le type de salle

    public Classroom() {}

    public Classroom(String name, Integer capacity, ClassroomType type) {
        this.name = name;
        this.capacity = capacity;
        this.type = type;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public ClassroomType getType() {
        return type;
    }

    public void setType(ClassroomType type) {
        this.type = type;
    }

    // Enum pour le type de salle
    public enum ClassroomType {
        AMPHI, 
        SALLE_TP,
        SALLE_TD
    }
}
