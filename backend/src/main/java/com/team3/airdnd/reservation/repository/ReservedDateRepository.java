package com.team3.airdnd.reservation.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.team3.airdnd.reservation.domain.ReservedDate;

public interface ReservedDateRepository extends JpaRepository<ReservedDate, Long> {

	@Query("""
		    SELECT rd FROM ReservedDate rd
		    WHERE rd.accommodation.id = :accommodationId
		    AND rd.reservedDate BETWEEN :checkIn AND :checkOutExclusive
		""")
	List<ReservedDate> findOverlappingDates(
		@Param("accommodationId") Long accommodationId,
		@Param("checkIn") LocalDate checkIn,
		@Param("checkOutExclusive") LocalDate checkOutExclusive
	);

	@Modifying
	@Query("""
		    DELETE FROM ReservedDate rd
		    WHERE rd.accommodation.id = :accommodationId
		    AND rd.reservedDate BETWEEN :checkIn AND :checkOutExclusive
		""")
	void deleteByAccommodationIdAndDateRange(
		@Param("accommodationId") Long accommodationId,
		@Param("checkIn") LocalDate checkIn,
		@Param("checkOutExclusive") LocalDate checkOutExclusive
	);

}