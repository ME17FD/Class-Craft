package com.ClassCraft.site.models;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Student extends User {
    private String CNE;
    private String registrationNumber;
}