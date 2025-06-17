package com.team3.airdnd.accommodation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.team3.airdnd.accommodation.domain.AccommodationAmenity;
import com.team3.airdnd.accommodation.dto.AmenityDto;

public interface AccommodationAmenityRepository extends JpaRepository<AccommodationAmenity, Long> {

	@Query("""
		      SELECT new com.team3.airdnd.accommodation.dto.AmenityDto(
		        am.id,
		        am.name
		      )
		      FROM AccommodationAmenity aa
		      JOIN aa.amenity am
		      WHERE aa.accommodation.id = :accommodationId
		""")
	List<AmenityDto> findAmenityByAccommodationId(
		@Param("accommodationId") Long accommodationId
	);

	void deleteByAccommodationId(Long accommodationId);
}
