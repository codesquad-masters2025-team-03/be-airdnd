package com.team3.airdnd;

import java.util.List;

import com.team3.airdnd.accommodation.domain.AmenityType;
import com.team3.airdnd.accommodation.dto.AccommodationRequestDto;

public class AccommodationTestFactory {
	public static AccommodationRequestDto.CreateAccommodationDto createDto(Long hostId) {
		return AccommodationRequestDto.CreateAccommodationDto.builder()
			.name("테스트 숙소")
			.pricePerNight(150000)
			.description("설명입니다")
			.maxGuests(2)
			.bedCount(1)
			.roomCount(1)
			.amenityTypes(List.of(AmenityType.WIFI, AmenityType.AIR_CONDITIONER))
			.city("서울")
			.district("강남구")
			.streetAddress("테헤란로")
			.detailAddress("123")
			.latitude(37.5)
			.longitude(127.0)
			.build();
	}
}
