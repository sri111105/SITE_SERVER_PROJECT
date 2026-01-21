package com.isp.sitesurvey.dto;

import lombok.Data;

@Data
public class PropertyDto {
    private Long id;
    private String name;
    private String address;
    private String clientName;
}
