package com.ClassCraft.site.service;

import java.util.List;
import java.util.Optional;

import com.ClassCraft.site.dto.UserDTO;
import com.ClassCraft.site.models.User;


// UserService.java
public interface UserService<T extends UserDTO> {
    T create(T dto);
    Optional<T> getById(Long id);
    List<T> getAll();
    T update(Long id, T dto);
    void delete(Long id);
    boolean approveUser(Long id);
    User findByEmail(String email);
    UserDTO convertToDTO(User user);
    boolean existsByEmail(String email);
}