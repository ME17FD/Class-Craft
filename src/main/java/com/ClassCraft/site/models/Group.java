package com.ClassCraft.site.models;

import jakarta.persistence.*;
import java.util.List;
import lombok.*;

@Entity
@Getter
@Setter
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @OneToMany(mappedBy = "group")
    private List<Student> students;
    
    @ManyToOne
    private Filiere filiere;
    
    public Integer getSize() {
        return students != null ? students.size() : 0;
    }
}