package com.team3.airdnd.reservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.team3.airdnd.reservation.domain.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
	boolean existsByAccommodationId(Long accommodationId);
}
