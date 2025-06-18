package com.team3.airdnd.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class ReservationResponseDto {

	@Getter
	@Builder
	@AllArgsConstructor
	public static class CreateReservationResponseDto {
		private Long reservationId;
		private String orderId;
		private String status;
		private Long amount;
	}

}
