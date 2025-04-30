package com.ClassCraft.site.models;


import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("AMPHITHEATRE")
public class Amphitheatre extends Classroom {
    private Boolean hasMicrophone;

    public Boolean getHasMicrophone() {
        return hasMicrophone;
    }

    public void setHasMicrophone(Boolean hasMicrophone) {
        this.hasMicrophone = hasMicrophone;
    }
}
