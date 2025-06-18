package com.team3.airdnd.reservation.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class ReservationRequestDto {

	@Getter
	@Builder
	@AllArgsConstructor
	public static class CreateReservationRequestDto {
		private Long accommodationId;
		private LocalDate checkIn;
		private LocalDate checkOut;
		private int guestCount;
		private Long userId;
	}

	@Getter
	@Builder
	@AllArgsConstructor
	public static class UpdateReservationStatusRequestDto {
		private String status;
	}
}
