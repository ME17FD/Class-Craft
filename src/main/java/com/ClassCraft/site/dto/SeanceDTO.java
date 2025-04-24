package com.ClassCraft.site.dto;

import java.sql.Time;

public class SeanceDTO {
    private Long id;
    private String dayOfWeek;
    private Time startTime;
    private Time endTime;
    private String frequency;
    private Boolean wasAttended;
    private Long subModuleId;
    private Long groupId;
    private Long classroomId;
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
    public String getFrequency() {
        return frequency;
    }
    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }
    public Boolean getWasAttended() {
        return wasAttended;
    }
    public void setWasAttended(Boolean wasAttended) {
        this.wasAttended = wasAttended;
    }
    public Long getSubModuleId() {
        return subModuleId;
    }
    public void setSubModuleId(Long subModuleId) {
        this.subModuleId = subModuleId;
    }
    public Long getGroupId() {
        return groupId;
    }
    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }
    public Long getClassroomId() {
        return classroomId;
    }
    public void setClassroomId(Long classroomId) {
        this.classroomId = classroomId;
    }

    // Getters and setters
}