package com.team3.airdnd.accommodation.dto;

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

	@Min(value = -90, message = "북동 위도는 -90 이상이어야 합니다.")
	@Max(value = 90, message = "북동 위도는 90 이하여야 합니다.")
	private Double northEastLat;

	@Min(value = -180, message = "북동 경도는 -180 이상이어야 합니다.")
	@Max(value = 180, message = "북동 경도는 180 이하여야 합니다.")
	private Double northEastLng;

	@Min(value = -90, message = "남서 위도는 -90 이상이어야 합니다.")
	@Max(value = 90, message = "남서 위도는 90 이하여야 합니다.")
	private Double southWestLat;

	@Min(value = -180, message = "남서 경도는 -180 이상이어야 합니다.")
	@Max(value = 180, message = "남서 경도는 180 이하여야 합니다.")
	private Double southWestLng;

	public boolean isValidPriceRange() {
		return minPrice != null && maxPrice != null && minPrice <= maxPrice;
	}
}
