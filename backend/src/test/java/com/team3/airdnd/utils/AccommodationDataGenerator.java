package com.team3.airdnd.utils;
/*
import org.springframework.transaction.annotation.Transactional;

import com.team3.airdnd.accommodation.domain.Accommodation;
import com.team3.airdnd.accommodation.repository.AccommodationRepository;

public class AccommodationDataGenerator {
	private final AccommodationRepository accommodationRepository;
	private final Address address;
	private final User host;

	public AccommodationDataGenerator(AccommodationRepository accommodationRepository, Address address, User host) {
		this.accommodationRepository = accommodationRepository;
		this.address = address;
		this.host = host;
	}

	@Transactional
	public Accommodation generateAccommodation() {
		Accommodation accommodation = Accommodation.builder()
			.name("부산 해운대 오션뷰 숙소")
			.pricePerNight(120000)
			.description("바다 전망 좋은 해운대 숙소입니다.")
			.maxGuests(4)
			.bedCount(2)
			.roomCount(2)
			.address(address)
			.host(host)
			.build();

		return accommodationRepository.save(accommodation);
	}
}
*/