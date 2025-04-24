package com.ClassCraft.site.dto;

import com.ClassCraft.site.models.Admin;
import com.ClassCraft.site.models.Professor;
import com.ClassCraft.site.models.User;

public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Boolean approved;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }
public UserDTO convertToDTO(User user) {
    if (user instanceof Professor professor) {
        ProfessorDTO dto = new ProfessorDTO();
        dto.setId(professor.getId());
        dto.setEmail(professor.getEmail());
        dto.setFirstName(professor.getFirstName());
        dto.setLastName(professor.getLastName());
        dto.setApproved(professor.getApproved());
        dto.setSpecialty(professor.getSpecialty());
        dto.setGrade(professor.getGrade());
        return dto;
    } else if (user instanceof Admin admin) {
        AdminDTO dto = new AdminDTO();
        dto.setId(admin.getId());
        dto.setEmail(admin.getEmail());
        dto.setFirstName(admin.getFirstName());
        dto.setLastName(admin.getLastName());
        dto.setApproved(admin.getApproved());
        dto.setRole(admin.getRole()); // or admin.getRole() if it's dynamic
        return dto;
    }
    // Add student or others similarly
    UserDTO dto = new UserDTO();
    dto.setId(user.getId());
    dto.setEmail(user.getEmail());
    dto.setFirstName(user.getFirstName());
    dto.setLastName(user.getLastName());
    dto.setApproved(user.getApproved());
    return dto;
}

}