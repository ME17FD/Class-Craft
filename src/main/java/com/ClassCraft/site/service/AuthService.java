package com.ClassCraft.site.service;

import com.ClassCraft.site.dto.AuthResponseDTO;
import com.ClassCraft.site.dto.LoginDTO;

public interface AuthService {
    AuthResponseDTO login(LoginDTO loginDTO);
}
