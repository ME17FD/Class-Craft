package com.ClassCraft.site.models;


import jakarta.persistence.Entity;

@Entity
public class Amphitheatre extends Classroom {
    private Boolean hasMicrophone;

    public Boolean getHasMicrophone() {
        return hasMicrophone;
    }

    public void setHasMicrophone(Boolean hasMicrophone) {
        this.hasMicrophone = hasMicrophone;
    }
}
