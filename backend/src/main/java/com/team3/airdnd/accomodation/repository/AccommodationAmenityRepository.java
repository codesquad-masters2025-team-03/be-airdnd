package com.team3.airdnd.accomodation.repository;

import com.team3.airdnd.accomodation.domain.AccommodationAmenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AccommodationAmenityRepository extends JpaRepository<AccommodationAmenity, Long> {
    @Query("""
        SELECT am.name
        FROM AccommodationAmenity aa
        JOIN aa.amenity am
        WHERE aa.accommodation.id = :accommodationId
    """)
    List<String> findAmenityNamesByAccommodationId(
            @Param("accommodationId") Long accommodationId);
}