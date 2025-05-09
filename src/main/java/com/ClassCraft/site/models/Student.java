package com.ClassCraft.site.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Student extends User {
    private String CNE;
    private String registrationNumber;
    @ManyToOne
    @JoinColumn(name = "group_id")
     @JsonBackReference 
    private Group group;
}