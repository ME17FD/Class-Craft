package com.ClassCraft.site.dto;

import com.ClassCraft.site.models.Classroom.ClassroomType;

public class ClassroomDTO {
    private Long id;
    private String name;
    private Integer capacity;
    private ClassroomType type; // Utilisation de l'énumération ClassroomType pour type

    // Getters and Setters
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

    // Constructeur par défaut
    public ClassroomDTO() {}

    // Constructeur avec paramètres
    public ClassroomDTO(Long id, String name, Integer capacity, ClassroomType type) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.type = type;
    }
}
