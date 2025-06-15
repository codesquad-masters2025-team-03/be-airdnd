package com.team3.airdnd.accommodation.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PriceHistogramRequestDto(
	@NotBlank(message = "지역은 필수입니다.")
	String location,

	@NotNull(message = "체크인 날짜는 필수입니다.")
	LocalDate checkIn,

	@NotNull(message = "체크아웃 날짜는 필수입니다.")
	LocalDate checkOut,

	@NotNull(message = "인원 수는 필수입니다.")
	@Min(value = 1, message = "인원 수는 1명 이상이어야 합니다.")
	Integer guests
) {
}
