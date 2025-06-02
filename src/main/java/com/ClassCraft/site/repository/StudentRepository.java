package com.ClassCraft.site.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Student;


@Repository
public interface StudentRepository extends UserRepository<Student> {
    List<Student> findByGroupId(Long groupId);
    int countByGroupId(Long groupId);
    boolean existsByCNE(String cne);
    boolean existsByRegistrationNumber(String registrationNumber);
    List<Student> findByApprovedIsNullOrApprovedFalse();
}
