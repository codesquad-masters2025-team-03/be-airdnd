package com.team3.airdnd.storedFile;

import org.springframework.data.jpa.repository.JpaRepository;
import com.team3.airdnd.storedFile.domain.StoredFile;

import java.util.List;

public interface StoredFileRepository extends JpaRepository<StoredFile, Long> {
    List<StoredFile> findByTargetTypeAndTargetIdOrderByFileOrderAsc(
            StoredFile.TargetType targetType,
            Long targetId
    );
}
