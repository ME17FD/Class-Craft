package com.ClassCraft.site.models;

import jakarta.persistence.*;
import java.util.List;
import lombok.*;

@Entity
@Getter
@Setter
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String code;
    
    @ManyToOne
    private Filiere filiere;
    
    @OneToMany(mappedBy = "module")
    private List<SubModule> subModules;
    
    @ManyToOne
    private Professor professorInCharge;
}