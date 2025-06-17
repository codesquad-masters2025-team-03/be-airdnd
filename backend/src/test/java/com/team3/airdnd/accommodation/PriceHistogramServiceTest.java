package com.team3.airdnd.accommodation;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDate;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.team3.airdnd.AbstractIntegrationTest;
import com.team3.airdnd.accommodation.dto.PriceHistogramConditionDto;
import com.team3.airdnd.accommodation.dto.PriceHistogramResponseDto;
import com.team3.airdnd.accommodation.service.AccommodationService;

import jakarta.persistence.EntityManager;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("가격 히스토그램 기능 테스트")
class PriceHistogramServiceTest extends AbstractIntegrationTest {

	@Autowired
	private AccommodationService accommodationService;

	@Autowired
	private EntityManager em;

	@Nested
	@DisplayName("숙소 필터링 기능 테스트")
	class FilteringCondition {

		@Test
		@DisplayName("필터에 해당하는 값은 총 10개가 나온다.")
		void shouldMatchTotalHistogramCountWithAvailableAccommodations() {
			PriceHistogramConditionDto request = PriceHistogramConditionDto.builder()
				.location("부산")
				.checkIn(LocalDate.of(2025, 6, 20))
				.checkOut(LocalDate.of(2025, 6, 27))
				.guests(2)
				.build();

			PriceHistogramResponseDto result = accommodationService.getPriceHistogram(request);

			int totalCount = result.priceHistogram().stream().mapToInt(Integer::intValue).sum();
			assertThat(totalCount).isEqualTo(10);
		}
	}

	@Nested
	@DisplayName("히스토그램 분포 계산 테스트")
	class HistogramCalculation {

		@Test
		@DisplayName("150000원 숙소 10개는 중앙 bin에만 분포된다")
		void shouldDistributeSamePriceIntoCenterBinOnly() {

			PriceHistogramConditionDto request = PriceHistogramConditionDto.builder()
				.location("부산")
				.checkIn(LocalDate.of(2025, 6, 20))
				.checkOut(LocalDate.of(2025, 6, 27))
				.guests(2)
				.build();

			PriceHistogramResponseDto result = accommodationService.getPriceHistogram(request);

			int centerBin = 50 / 2;
			for (int i = 0; i < 50; i++) {
				if (i == centerBin) {
					assertThat(result.priceHistogram().get(i)).isEqualTo(10);
				} else {
					assertThat(result.priceHistogram().get(i)).isEqualTo(0);
				}
			}
		}

		@Test
		@DisplayName("최소/최대 가격은 150000으로 동일하다")
		void shouldHaveEqualMinAndMaxWhenAllPricesAreSame() {
			PriceHistogramConditionDto request = PriceHistogramConditionDto.builder()
				.location("부산")
				.checkIn(LocalDate.of(2025, 6, 20))
				.checkOut(LocalDate.of(2025, 6, 27))
				.guests(2)
				.build();

			PriceHistogramResponseDto result = accommodationService.getPriceHistogram(request);

			assertThat(result.minValue()).isEqualTo(150000);
			assertThat(result.maxValue()).isEqualTo(150000);
		}

		@Test
		@DisplayName("가격 리스트가 비어있을 경우 0으로 채워진 히스토그램을 반환한다")
		void shouldReturnZeroFilledHistogramWhenNoData() {
			// when
			PriceHistogramConditionDto request = PriceHistogramConditionDto.builder()
				.location("부산")
				.checkIn(LocalDate.of(2025, 6, 20))
				.checkOut(LocalDate.of(2025, 6, 27))
				.guests(99)
				.build();

			PriceHistogramResponseDto result = accommodationService.getPriceHistogram(request);

			// then
			assertThat(result.priceHistogram()).hasSize(50);
			assertThat(result.priceHistogram()).allMatch(bin -> bin == 0);
			assertThat(result.minValue()).isEqualTo(0);
			assertThat(result.maxValue()).isEqualTo(0);
		}
	}
}
