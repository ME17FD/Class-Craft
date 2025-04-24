package com.ClassCraft.site.dto;

public class ClassroomDTO {
    private Long id;
    private String name;
    private Integer capacity;
    private String type; // "SALLE" or "AMPHITHEATRE"
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
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    // Getters and setters
}