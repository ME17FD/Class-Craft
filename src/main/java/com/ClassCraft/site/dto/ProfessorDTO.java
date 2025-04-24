package com.ClassCraft.site.dto;

public class ProfessorDTO extends UserDTO {
    private String specialty;
    private String grade;
    
    public String getSpecialty() {
        return specialty;
    }
    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }
    public String getGrade() {
        return grade;
    }
    public void setGrade(String grade) {
        this.grade = grade;
    }

    // Getters and setters
}