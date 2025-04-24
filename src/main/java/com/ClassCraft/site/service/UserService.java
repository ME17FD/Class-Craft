package com.ClassCraft.site.service;

import java.util.List;
import java.util.Optional;

import com.ClassCraft.site.dto.UserDTO;


// UserService.java
public interface UserService<T extends UserDTO> {
    T create(T dto);
    Optional<T> getById(Long id);
    List<T> getAll();
    T update(Long id, T dto);
    void delete(Long id);
    boolean approveUser(Long id);
}