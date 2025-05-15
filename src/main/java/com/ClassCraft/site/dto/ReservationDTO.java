package com.ClassCraft.site.dto;

import java.time.LocalDateTime;

public class ReservationDTO {
    private Long id;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Boolean wasAttended;
    private Long subModuleId;
    private Long groupId;
    private Long classroomId;
    private SubModuleDTO submodule;
    private String groupName;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }
    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }
    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }
    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
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

    public SubModuleDTO getSubmodule() {
        return submodule;
    }

    public void setSubmodule(SubModuleDTO submodule) {
        this.submodule = submodule;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }


    
}