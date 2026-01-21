package com.isp.sitesurvey.dto;

import lombok.Data;

@Data
public class FloorDto {
    private Long id;
    private String name;
    private Integer level;
    private Long buildingId;
}
