package com.team3.airdnd.accommodation.repository;

import com.team3.airdnd.accommodation.dto.AccommodationResponseDto;

public interface AccommodationQueryRepository {
	AccommodationResponseDto.AccommodationListDto getAccommodationListByPage(int page, int size);
}
