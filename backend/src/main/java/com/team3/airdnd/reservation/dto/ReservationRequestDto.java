package com.team3.airdnd.reservation.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class ReservationRequestDto {

	@Getter
	@Builder
	@AllArgsConstructor
	public static class CreateReservationRequestDto {
		@NotNull(message = "체크인 날짜는 필수입니다.")
		@FutureOrPresent(message = "체크인 날짜는 오늘 이후여야 합니다.")
		private LocalDate checkIn;

		@NotNull(message = "체크아웃 날짜는 필수입니다.")
		@Future(message = "체크아웃 날짜는 미래여야 합니다.")
		private LocalDate checkOut;

		@NotNull(message = "인원 수는 필수입니다.")
		@Min(value = 1, message = "인원 수는 1명 이상이어야 합니다.")
		private int guests;

		@AssertTrue(message = "체크인 날짜는 체크아웃 날짜보다 이전이어야 합니다.")
		public boolean isValidDateRange() {
			return checkIn != null && checkOut != null && checkIn.isBefore(checkOut);
		}
	}

	@Getter
	@Builder
	@AllArgsConstructor
	public static class UpdateReservationStatusRequestDto {
		private String status;
	}
}
