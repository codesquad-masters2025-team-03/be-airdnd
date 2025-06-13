package com.team3.airdnd.accomodation.repository;

import com.team3.airdnd.accomodation.domain.Accommodation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
}
