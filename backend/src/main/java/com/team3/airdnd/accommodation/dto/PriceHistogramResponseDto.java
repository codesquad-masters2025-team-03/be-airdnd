package com.team3.airdnd.accommodation.dto;

import java.util.List;

public record PriceHistogramResponseDto(
	int minValue,
	int maxValue,
	List<Integer> priceHistogram
) {
}
