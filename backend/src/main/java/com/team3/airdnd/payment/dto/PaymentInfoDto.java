package com.team3.airdnd.payment.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
public class PaymentInfoDto {
	private Long accommodationId;
	private String title;
	private String imageUrl;
	private LocalDate checkIn;
	private LocalDate checkOut;
	private int guestCount;
	private long pricePerNight;
	private long totalPrice;
	private long serviceFee;

	@Builder
	public PaymentInfoDto(Long accommodationId, String title, String imageUrl,
		LocalDate checkIn, LocalDate checkOut, int guestCount,
		long pricePerNight, long totalPrice, long serviceFee) {
		this.accommodationId = accommodationId;
		this.title = title;
		this.imageUrl = imageUrl;
		this.checkIn = checkIn;
		this.checkOut = checkOut;
		this.guestCount = guestCount;
		this.pricePerNight = pricePerNight;
		this.totalPrice = totalPrice;
		this.serviceFee = serviceFee;
	}
}
