package com.ClassCraft.site.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "student_group")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Student> students;

    @ManyToOne
    @JoinColumn(name = "filiere_id", nullable = true)
    @JsonBackReference
    private Filiere filiere;

    // Getter for id
    public Long getId() {
        return id;
    }

    // Setter for id
    public void setId(Long id) {
        this.id = id;
    }

    // Getter for name
    public String getName() {
        return name;
    }

    // Setter for name
    public void setName(String name) {
        this.name = name;
    }

    // Getter for students
    public List<Student> getStudents() {
        return students;
    }

    // Setter for students
    public void setStudents(List<Student> students) {
        this.students = students;
    }

    // Getter for filiere
    public Filiere getFiliere() {
        return filiere;
    }

    // Setter for filiere
    public void setFiliere(Filiere filiere) {
        this.filiere = filiere;
    }

    // Getter for size of students
    public Integer getSize() {
        return students != null ? students.size() : 0;
    }

    // Setter for size of students (Not necessary if you don't want to manually change the size)
    public void setSize(Integer size) {
        // Not required as size is derived from students list size
    }
}
