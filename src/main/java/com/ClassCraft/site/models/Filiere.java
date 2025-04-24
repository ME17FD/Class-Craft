package com.ClassCraft.site.models;

import jakarta.persistence.*;
import java.util.List;
import lombok.*;

@Entity
@Getter
@Setter
public class Filiere {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    
    @OneToMany(mappedBy = "filiere")
    private List<Group> groups;
    
    @OneToMany(mappedBy = "filiere")
    private List<Module> modules;
    
    @ManyToOne
    private Session session;
}