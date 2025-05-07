package com.ClassCraft.site.dto;

import java.util.List;

public class ModuleDTO {
    private Long id;
    private String name;
    private String code;
    private Long filiereId;
    private Long professorInChargeId;
    private ProfessorDTO professorInCharge;
    private List<SubModuleDTO> subModules;
    private String professorInChargeName;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }
    public Long getFiliereId() {
        return filiereId;
    }
    public void setFiliereId(Long filiereId) {
        this.filiereId = filiereId;
    }
    public Long getProfessorInChargeId() {
        return professorInChargeId;
    }
    public void setProfessorInChargeId(Long professorInChargeId) {
        this.professorInChargeId = professorInChargeId;
    }

    // Getters and setters

    public String getProfessorInChargeName() {
        return professorInChargeName;
    }

    public void setProfessorInChargeName(String professorInChargeName) {
        this.professorInChargeName = professorInChargeName;
    }

    public ProfessorDTO getProfessorInCharge() {
        return professorInCharge;
    }

    public void setProfessorInCharge(ProfessorDTO professorInCharge) {
        this.professorInCharge = professorInCharge;
    }

    public List<SubModuleDTO> getSubModules() {
        return subModules;
    }

    public void setSubModules(List<SubModuleDTO> subModules) {
        this.subModules = subModules;
    }
    
}