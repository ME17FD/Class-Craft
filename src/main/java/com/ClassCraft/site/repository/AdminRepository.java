package com.ClassCraft.site.repository;


import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Admin;

@Repository
public interface AdminRepository extends UserRepository<Admin> {
    
    // Add admin-specific queries here if needed in the future
}
