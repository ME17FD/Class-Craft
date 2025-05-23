package com.ClassCraft.site.dto;

public class SubModuleDTO {
    private Long id;
    private String name;
    private Integer nbrHours;
    private Long moduleId;
    private String moduleName;
    private Long teacherId;
    private ProfessorDTO teacher;
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
    public Integer getNbrHours() {
        return nbrHours;
    }
    public void setNbrHours(Integer nbrHours) {
        this.nbrHours = nbrHours;
    }
    public Long getModuleId() {
        return moduleId;
    }
    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }
    public Long getTeacherId() {
        return teacherId;
    }
    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    // Getters and setters

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public ProfessorDTO getTeacher() {
        return teacher;
    }

    public void setTeacher(ProfessorDTO teacher) {
        this.teacher = teacher;
    }
}