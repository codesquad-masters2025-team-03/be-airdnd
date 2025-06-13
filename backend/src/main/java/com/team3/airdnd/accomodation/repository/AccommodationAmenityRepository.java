package com.team3.airdnd.accomodation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.team3.airdnd.accomodation.domain.AccommodationAmenity;


public interface AccommodationAmenityRepository extends JpaRepository<AccommodationAmenity, Long> {
	List<AccommodationAmenity> findByAccommodation_Id(Long accommodationId);;
}
