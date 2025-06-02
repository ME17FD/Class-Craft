package com.ClassCraft.site.dto;

import com.ClassCraft.site.models.Student;

public class StudentDTO extends UserDTO {
    private String CNE;
    private String registrationNumber;
    private Long groupId;
    private String groupName;
    private String password;
    private Boolean approved;

    public static StudentDTO fromEntity(Student student) {
        StudentDTO dto = new StudentDTO();
        
        // Set UserDTO fields
        dto.setId(student.getId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());
        dto.setApproved(student.getApproved());
        
        // Set Student-specific fields
        dto.setCNE(student.getCNE());
        dto.setRegistrationNumber(student.getRegistrationNumber());
        
        // Set group info (without creating circular reference)
        if (student.getGroup() != null) {
            dto.setGroupId(student.getGroup().getId());
            dto.setGroupName(student.getGroup().getName());
        }
        
        return dto;
    }

    // Getters and setters
    public String getCNE() { return CNE; }
    public void setCNE(String CNE) { this.CNE = CNE; }
    
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    
    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}