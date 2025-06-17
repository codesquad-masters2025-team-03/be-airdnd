package com.team3.airdnd.accommodation.dto;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PriceHistogramConditionDto extends BaseSearchConditionDto {
	@Builder
	public PriceHistogramConditionDto(String location, LocalDate checkIn, LocalDate checkOut, Integer guests) {
		this.location = location;
		this.checkIn = checkIn;
		this.checkOut = checkOut;
		this.guests = guests;
	}
}
