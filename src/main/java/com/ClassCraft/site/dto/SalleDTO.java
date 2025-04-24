package com.ClassCraft.site.dto;

public class SalleDTO extends ClassroomDTO {
    private Boolean hasProjector;

    public SalleDTO() {
        this.setType("SALLE");
    }

    public Boolean getHasProjector() {
        return hasProjector;
    }

    public void setHasProjector(Boolean hasProjector) {
        this.hasProjector = hasProjector;
    }
}