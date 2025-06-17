package com.team3.airdnd.accommodation.dto;

import com.team3.airdnd.accommodation.domain.AmenityType;

public record AmenityDto(
	Long id,
	AmenityType type
) {
}
