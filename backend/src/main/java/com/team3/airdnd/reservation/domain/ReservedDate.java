package com.team3.airdnd.reservation.domain;

import java.time.LocalDate;

import com.team3.airdnd.accommodation.domain.Accommodation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservedDate {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// 예약된 숙소
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "accommodation_id", nullable = false)
	private Accommodation accommodation;

	// 예약된 날짜 (체크인 ~ 체크아웃-1 범위의 하루)
	@Column(name = "reserved_date", nullable = false)
	private LocalDate reservedDate;
}

