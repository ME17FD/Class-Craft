package com.ClassCraft.site.dto;


import java.util.List;

import lombok.Data;

@Data
public class StudentGroupUpdateRequest {
    private List<Long> studentIds;
}
