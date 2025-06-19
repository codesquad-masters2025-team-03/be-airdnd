package com.team3.airdnd.accommodation.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@SuperBuilder
public class AccommodationListConditionDto extends BaseSearchConditionDto {

	@Min(value = 1000, message = "최소 요금은 1,000원 이상이어야 합니다.")
	@Max(value = 10000000, message = "최소 요금은 10,000,000원 이하여야 합니다.")
	private Integer minPrice;

	@Min(value = 1000, message = "최대 요금은 1,000원 이상이어야 합니다.")
	@Max(value = 10000000, message = "최대 요금은 10,000,000원 이하여야 합니다.")
	private Integer maxPrice;

	private Double northEastLat;

	private Double northEastLng;

	private Double southWestLat;

	private Double southWestLng;

	@AssertTrue(message = "최소 요금은 최대 요금보다 클 수 없습니다.")
	public boolean isValidPriceRange() {
		return minPrice != null && maxPrice != null && minPrice <= maxPrice;
	}
}
