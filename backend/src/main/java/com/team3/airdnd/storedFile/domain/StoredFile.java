package com.team3.airdnd.storedFile.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class StoredFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    // MIME 타입 또는 확장자 (예: image/png)
    @Column(name = "file_type", nullable = false)
    private String fileType;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private TargetType targetType;

    // 실제 참조하는 대상 ID (accommodation_id 또는 message_id)
    @Column(nullable = false)
    private Long targetId;

    @Column(name = "file_order", nullable = false)
    private Integer fileOrder;

    public enum TargetType {
        ACCOMMODATION,
        CHAT_MESSAGE
    }
}
