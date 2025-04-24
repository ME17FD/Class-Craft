package com.ClassCraft.site.dto;

public class AuthResponseDTO {
    private String token;
    private String role;
    private UserDTO userDetails;
    
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public UserDTO getUserDetails() {
        return userDetails;
    }
    public void setUserDetails(UserDTO userDetails) {
        this.userDetails = userDetails;
    }

    // Getters and setters
}