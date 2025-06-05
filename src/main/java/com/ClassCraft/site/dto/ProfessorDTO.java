package com.ClassCraft.site.dto;

import java.util.List;

public class ProfessorDTO extends UserDTO {
    private String specialty;
    private String grade;
    private List<ModuleDTO> modules;
    private List<SubModuleDTO> subModules;
    
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

    public List<ModuleDTO> getModules() {
        return modules;
    }

    public void setModules(List<ModuleDTO> modules) {
        this.modules = modules;
    }

    public List<SubModuleDTO> getSubModules() {
        return subModules;
    }

    public void setSubModules(List<SubModuleDTO> subModules) {
        this.subModules = subModules;
    }


}