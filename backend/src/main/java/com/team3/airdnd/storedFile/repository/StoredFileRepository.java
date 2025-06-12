package com.team3.airdnd.storedFile.repository;

import com.team3.airdnd.storedFile.dto.ImageUrlDto;
import org.springframework.data.jpa.repository.JpaRepository;
import com.team3.airdnd.storedFile.domain.StoredFile;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StoredFileRepository extends JpaRepository<StoredFile, Long> {
    @Query("""
        SELECT new com.team3.airdnd.storedFile.dto.ImageUrlDto(
            s.id,
            s.fileUrl
        )
        FROM StoredFile s
        WHERE s.targetType = :targetType AND s.targetId = :targetId
        ORDER BY s.fileOrder ASC
    """)
    List<ImageUrlDto> findImageByTargetTypeAndTargetIdOrderByFileOrderAsc(
            @Param("targetType") StoredFile.TargetType targetType,
            @Param("targetId") Long targetId
    );
}