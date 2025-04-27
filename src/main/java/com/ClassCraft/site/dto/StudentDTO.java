package com.ClassCraft.site.dto;

public class StudentDTO extends UserDTO {
    private String CNE;
    private String registrationNumber;
    private Long groupId;
    private String groupName;
    private String phone;
    private String password;


    // Getters and setters
    public String getCNE() { return CNE; }
    public void setCNE(String CNE) { this.CNE = CNE; }
    
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    
    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}