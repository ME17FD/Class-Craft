package com.ClassCraft.site.dto;

import java.sql.Time;

public class SeanceDTO {
    private Long id;
    private String dayOfWeek;
    private Time startTime;
    private Time endTime;
    private int frequency;
    private Boolean wasAttended;

    private String type;
    private GroupDTO group;
    private SubModuleDTO subModule;
    private ModuleDTO module;
    private ProfessorDTO professor;
    private ClassroomDTO classroom;

    // Getters & Setters
    

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }
    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public Time getStartTime() {
        return startTime;
    }
    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Time getEndTime() {
        return endTime;
    }
    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }

    public int getFrequency() {
        return frequency;
    }
    public void setFrequency(int frequency) {
        this.frequency = frequency;
    }

    public Boolean getWasAttended() {
        return wasAttended;
    }
    public void setWasAttended(Boolean wasAttended) {
        this.wasAttended = wasAttended;
    }

    public GroupDTO getGroup() {
        return group;
    }
    public void setGroup(GroupDTO group) {
        this.group = group;
    }

    public SubModuleDTO getSubModule() {
        return subModule;
    }
    public void setSubModule(SubModuleDTO subModule) {
        this.subModule = subModule;
    }

    public ModuleDTO getModule() {
        return module;
    }
    public void setModule(ModuleDTO module) {
        this.module = module;
    }

    public ProfessorDTO getProfessor() {
        return professor;
    }
    public void setProfessor(ProfessorDTO professor) {
        this.professor = professor;
    }

    public ClassroomDTO getClassroom() {
        return classroom;
    }
    public void setClassroom(ClassroomDTO classroom) {
        this.classroom = classroom;
    }
}
