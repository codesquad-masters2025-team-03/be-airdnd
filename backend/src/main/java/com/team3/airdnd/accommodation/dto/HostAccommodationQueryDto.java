package com.team3.airdnd.accommodation.dto;

public record HostAccommodationQueryDto(
	Long id,
	String name,
	String city,
	String district,
	String streetAddress
) {
}
