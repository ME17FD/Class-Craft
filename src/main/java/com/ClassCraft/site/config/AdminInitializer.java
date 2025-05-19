package com.ClassCraft.site.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ClassCraft.site.models.Admin;
import com.ClassCraft.site.repository.AdminRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!adminRepository.existsByEmail("admin@classcraft.com")) {
            Admin admin = new Admin();
            admin.setEmail("admin@classcraft.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("main admin");
            // set other fields if necessary
            adminRepository.save(admin);
            System.out.println("Admin user created!");
        } else {
            System.out.println("Admin already exists.\nadmin@classcraft.com\nadmin123");
        }
    }
}
