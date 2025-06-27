package com.team3.airdnd.accommodation.dto;

import java.util.List;

import com.team3.airdnd.accommodation.domain.AmenityType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class AccommodationRequestDto {

	@Getter
	@Builder
	@AllArgsConstructor
	public static class CreateAccommodationDto {
		// 숙소 정보
		@NotBlank
		private String name;
		@Min(1000)
		private int pricePerNight;
		@NotBlank
		private String description;
		@Min(1)
		private int maxGuests;
		@Min(0)
		private int bedCount;
		@Min(0)
		private int roomCount; //todo 삭제
		@NotNull
		private List<AmenityType> amenityTypes;
		// 주소 정보
		@NotBlank
		private String city;
		@NotBlank
		private String district;
		@NotBlank
		private String streetAddress;
		private String detailAddress;
		private double latitude;
		private double longitude;
	}

	@Getter
	@Builder
	@AllArgsConstructor
	public static class UpdateAccommodationDto {
		private String name;
		private Integer pricePerNight;
		private String description;
		private Integer maxGuests;
		private Integer bedCount;
		private Integer roomCount;
		private List<AmenityType> amenityTypes;
		private String city;
		private String district;
		private String streetAddress;
		private String detailAddress;
		private Double latitude;
		private Double longitude;
	}
}
