package com.ClassCraft.site.dto;

public class AmphitheatreDTO extends ClassroomDTO {
    private Boolean hasMicrophone;

    public AmphitheatreDTO() {
        this.setType("AMPHITHEATRE");
    }

    public Boolean getHasMicrophone() {
        return hasMicrophone;
    }

    public void setHasMicrophone(Boolean hasMicrophone) {
        this.hasMicrophone = hasMicrophone;
    }
}