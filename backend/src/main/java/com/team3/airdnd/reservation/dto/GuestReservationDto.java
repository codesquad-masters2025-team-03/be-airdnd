package com.team3.airdnd.reservation.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
	private String coverImageUrl;
	private LocalDate checkIn;
	private LocalDate checkOut;
	private Long totalPrice;
	private Long serviceFee;
	private LocalDateTime createdAt;
	private Reservation.Status status;

	@QueryProjection
	public GuestReservationDto(Long reservationId, String orderId, String accommodationName, String coverImageUrl,
		LocalDate checkIn, LocalDate checkOut,
		Long totalPrice, Long serviceFee, LocalDateTime createdAt, Reservation.Status status) {
		this.reservationId = reservationId;
		this.orderId = orderId;
		this.accommodationName = accommodationName;
		this.coverImageUrl = coverImageUrl;
		this.checkIn = checkIn;
		this.checkOut = checkOut;
		this.totalPrice = totalPrice;
		this.serviceFee = serviceFee;
		this.createdAt = createdAt;
		this.status = status;
	}
}
