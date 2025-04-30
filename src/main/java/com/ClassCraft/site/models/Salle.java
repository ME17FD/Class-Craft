package com.ClassCraft.site.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@DiscriminatorValue("SALLE")
@Getter
@Setter
public class Salle extends Classroom {
    private Boolean hasProjector;
}
