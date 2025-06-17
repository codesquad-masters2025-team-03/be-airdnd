package com.team3.airdnd.accommodation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.team3.airdnd.accommodation.domain.Accommodation;
import com.team3.airdnd.accommodation.dto.HostAccommodationQueryDto;

public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
	Optional<Accommodation> findByName(String name);

	@Query("""
		    SELECT DISTINCT a FROM Accommodation a
		    JOIN FETCH a.address
		    WHERE a.id = :id
		""")
	Optional<Accommodation> findDetailById(@Param("id") Long id);

	@Query("""
		    SELECT new com.team3.airdnd.accommodation.dto.HostAccommodationQueryDto(
		        a.id,
		        a.name,
		        ad.city,
		        ad.district,
		        ad.streetAddress
		    )
		    FROM Accommodation a
		    JOIN a.address ad
		    WHERE a.host.id = :hostId
		""")
	List<HostAccommodationQueryDto> findAccommodationListByHostId(@Param("hostId") Long hostId);

}
