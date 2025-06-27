package com.team3.airdnd.reservation.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.querydsl.core.annotations.QueryProjection;
import com.team3.airdnd.reservation.domain.Reservation;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class HostReservationDto {
	private Long reservationId;
	private String guestName;
	private String orderId;
	private String accommodationName;
	private String coverImageUrl;
	private LocalDate checkIn;
	private LocalDate checkOut;
	private Reservation.Status status;
	private Long serviceFee;
	private Long totalPrice;
	private LocalDateTime createdAt;

	@QueryProjection
	public HostReservationDto(Long reservationId, String guestName, String orderId, String accommodationName,
		String coverImageUrl,
		LocalDate checkIn, LocalDate checkOut, Reservation.Status status,
		Long serviceFee, Long totalPrice, LocalDateTime createdAt) {
		this.reservationId = reservationId;
		this.guestName = guestName;
		this.orderId = orderId;
		this.accommodationName = accommodationName;
		this.coverImageUrl = coverImageUrl;
		this.checkIn = checkIn;
		this.checkOut = checkOut;
		this.status = status;
		this.serviceFee = serviceFee;
		this.totalPrice = totalPrice;
		this.createdAt = createdAt;
	}
}