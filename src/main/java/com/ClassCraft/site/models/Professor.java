package com.ClassCraft.site.models;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Professor extends User {
    private String specialty;
    private String grade;
}