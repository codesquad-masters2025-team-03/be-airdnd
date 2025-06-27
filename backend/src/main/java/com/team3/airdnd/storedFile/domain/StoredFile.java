package com.team3.airdnd.storedFile.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class StoredFile {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "file_url", nullable = false, length = 1000)
	private String fileUrl;

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
