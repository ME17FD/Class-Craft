package com.ClassCraft.site.models;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Filiere {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    
    @OneToMany(mappedBy = "filiere", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Group> groups;
    
    @OneToMany(mappedBy = "filiere", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Module> modules;
    
    @ManyToOne
    private Session session;
}