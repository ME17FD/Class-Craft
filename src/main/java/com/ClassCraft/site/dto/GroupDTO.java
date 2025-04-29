package com.ClassCraft.site.dto;

import java.util.List;

public class GroupDTO {
    private Long id;
    private String name;
    private Integer size;
    private Long filiereId;
    private String filiereName;  // Added for convenience
    private List<StudentInfoDTO> students;  // Nested DTO for student information

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Integer getSize() {
        if (size != null) {
            return size;
        }
        return students != null ? students.size() : 0;
    }
    
    public void setSize(Integer size) { this.size = size; }
    
    public Long getFiliereId() { return filiereId; }
    public void setFiliereId(Long filiereId) { this.filiereId = filiereId; }
    
    public String getFiliereName() { return filiereName; }
    public void setFiliereName(String filiereName) { this.filiereName = filiereName; }
    
    public List<StudentInfoDTO> getStudents() { return students; }
    public void setStudents(List<StudentInfoDTO> students) { this.students = students; }

    // Nested DTO for student information
    public static class StudentInfoDTO {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String CNE;
        private String registrationNumber;

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getCNE() { return CNE; }
        public void setCNE(String CNE) { this.CNE = CNE; }
        
        public String getRegistrationNumber() { return registrationNumber; }
        public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
        public StudentInfoDTO(Long id, String firstName, String lastName, String email, String cNE,
                String registrationNumber) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            CNE = cNE;
            this.registrationNumber = registrationNumber;
        }
    }

    public GroupDTO(Long id, String name, Integer size, Long filiereId, List<StudentInfoDTO> students) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.filiereId = filiereId;
        this.students = students;
    }
}