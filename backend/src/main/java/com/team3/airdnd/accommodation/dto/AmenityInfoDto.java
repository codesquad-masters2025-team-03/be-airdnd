package com.team3.airdnd.accommodation.dto;

import com.team3.airdnd.accommodation.domain.AmenityType;

public record AmenityInfoDto(
    Long id,
    AmenityType type
) {}
