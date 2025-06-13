package com.team3.airdnd.accomodation.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class AccommodationResponseDto {

	@AllArgsConstructor
	@Getter
	@Builder
	public static class AccommodationListDto{
		private Integer page;
		private Integer size;
		private Integer totalPages;
		private Integer totalElements;
		private List<AccommodationInfo> accommodations;
	}

	@AllArgsConstructor
	@Getter
	@Builder
	public static class AccommodationInfo{
		private Long id;
		private String name;
		private String imageUrl;
		private int pricePerNight;
		private String description;
		private int maxGuests;
		private int bedCount;
		private String addressId;
		private List<AmenityInfo> amenity;
		private double latitude;
		private double longitude;
	}

	@AllArgsConstructor
	@Getter
	@Builder
	public static class AmenityInfo{
		private Long id;
		private String name;
	}

}
