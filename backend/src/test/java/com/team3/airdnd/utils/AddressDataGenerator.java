package com.team3.airdnd.utils;

import org.springframework.transaction.annotation.Transactional;

import com.team3.airdnd.accommodation.domain.Address;
import com.team3.airdnd.accommodation.repository.AddressRepository;

public class AddressDataGenerator {

	private final AddressRepository addressRepository;

	public AddressDataGenerator(AddressRepository addressRepository) {
		this.addressRepository = addressRepository;
	}

	@Transactional
	public void generateAddress(){

		Address address = Address.builder()
			.city("부산광역시")
			.district("수영구")
			.streetAddress("수영로 533")
			.detailAddress("101호")
			.latitude(129.113)
			.longitude(35.157)
			.build();

		addressRepository.save(address);
	}
}
