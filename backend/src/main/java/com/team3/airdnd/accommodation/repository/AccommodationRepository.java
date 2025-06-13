package com.team3.airdnd.accommodation.repository;

import com.team3.airdnd.accommodation.domain.Accommodation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
}
