package com.team3.airdnd.accommodation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.team3.airdnd.accommodation.domain.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
	boolean existsByAccommodationId(Long accommodationId);
}
