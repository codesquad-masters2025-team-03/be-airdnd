package com.team3.airdnd.storedFile.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.team3.airdnd.storedFile.domain.StoredFile;

public interface StoredFileRepository extends JpaRepository<StoredFile, Long> {
	@Query("""
		    SELECT s.fileUrl
		    FROM StoredFile s
		    WHERE s.targetType = :targetType AND s.targetId = :targetId
		    ORDER BY s.fileOrder ASC
		""")
	List<String> findByTargetTypeAndTargetIdOrderByFileOrderAsc(
		@Param("targetType") StoredFile.TargetType targetType,
		@Param("targetId") Long targetId
	);

	@Query("""
		    SELECT s.fileUrl
		    FROM StoredFile s
		    WHERE s.targetType = :targetType
		      AND s.targetId = :targetId
		      AND s.fileOrder = 1
		""")
	String findFirstFileUrlByTargetTypeAndTargetId(
		@Param("targetType") StoredFile.TargetType targetType,
		@Param("targetId") Long targetId
	);

	List<StoredFile> findByTargetTypeAndTargetId(StoredFile.TargetType type, Long targetId);
}
