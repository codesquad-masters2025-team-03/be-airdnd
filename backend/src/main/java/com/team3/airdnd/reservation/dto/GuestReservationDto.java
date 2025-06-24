package com.team3.airdnd.reservation.dto;

import java.time.LocalDate;

import com.querydsl.core.annotations.QueryProjection;
import com.team3.airdnd.reservation.domain.Reservation;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class GuestReservationDto {
	private Long reservationId;
	private String orderId;
	private String accommodationName;
	private LocalDate checkIn;
	private LocalDate checkOut;
	private Long totalPrice;
	private Reservation.Status status;

	@QueryProjection
	public GuestReservationDto(Long reservationId, String orderId, String accommodationName,
		LocalDate checkIn, LocalDate checkOut,
		Long totalPrice, Reservation.Status status) {
		this.reservationId = reservationId;
		this.orderId = orderId;
		this.accommodationName = accommodationName;
		this.checkIn = checkIn;
		this.checkOut = checkOut;
		this.totalPrice = totalPrice;
		this.status = status;
	}
}