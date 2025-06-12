package com.team3.airdnd.storedFile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.team3.airdnd.storedFile.domain.StoredFile;

import java.util.List;

public interface StoredFileRepository extends JpaRepository<StoredFile, Long> {
    List<StoredFile> findAllByTargetTypeAndTargetIdOrderByFileOrderAsc(
            StoredFile.TargetType targetType,
            Long targetId
    );
}
