package com.team3.airdnd.accommodation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.team3.airdnd.accommodation.domain.Amenity;
import com.team3.airdnd.accommodation.domain.AmenityType;

public interface AmenityRepository extends JpaRepository<Amenity, Long> {
	List<Amenity> findByNameIn(List<AmenityType> types);
}
