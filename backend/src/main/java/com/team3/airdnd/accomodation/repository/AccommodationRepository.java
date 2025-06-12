package com.team3.airdnd.accomodation.repository;

import com.team3.airdnd.accomodation.domain.Accommodation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
    @Query("""
        SELECT DISTINCT a FROM Accommodation a
        JOIN FETCH a.address
        WHERE a.id = :id
    """)
    Optional<Accommodation> findDetailById(@Param("id") Long id);
}
