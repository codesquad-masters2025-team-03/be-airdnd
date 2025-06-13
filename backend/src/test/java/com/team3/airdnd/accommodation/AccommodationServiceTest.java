package com.team3.airdnd.accommodation;

import com.team3.airdnd.AbstractIntegrationTest;
import com.team3.airdnd.accommodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accommodation.dto.AmenityInfoDto;
import com.team3.airdnd.accommodation.service.AccommodationService;
import com.team3.airdnd.global.exception.CommonException;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
public class AccommodationServiceTest extends AbstractIntegrationTest {
    @Autowired
    private AccommodationService accommodationService;

    @Test
    @DisplayName("숙소 ID로 상세 정보를 조회할 수 있다")
    void getAccommodationDetail_success() {
        // given
        Long accommodationId = 1L;

        // when
        AccommodationResponseDto.AccommodationDetailDto result =
                accommodationService.getAccommodationDetail(accommodationId);

        // then
        assertThat(result.getName()).isEqualTo("제주 오션뷰 하우스");
        assertThat(result.getImageUrls()).hasSize(2);
        assertThat(result.getAmenities()).containsExactlyInAnyOrder(
                new AmenityInfoDto(1L, "헤어드라이기"),
                new AmenityInfoDto(2L, "세탁기"),
                new AmenityInfoDto(3L, "와이파이")
        );
        assertThat(result.getHostId()).isEqualTo(1L);
        assertThat(result.getAddress().getCity()).isEqualTo("제주도");
        assertThat(result.getReviews().getComments()).hasSize(2);
        assertThat(result.getReviews().getAvgRating()).isEqualTo(4.5);
    }

    @DisplayName("숙소가 존재하지 않으면 예외가 발생한다")
    @Test
    void getAccommodationDetail_notFound() {
        // given
        Long invalidId = 999L;

        // when & then
        assertThatThrownBy(() -> accommodationService.getAccommodationDetail(invalidId))
                .isInstanceOf(CommonException.class)
                .hasMessageContaining("해당 리소스가 존재하지 않습니다");
    }

    @DisplayName("숙소에 리뷰가 없으면 빈 리스트와 평균 0.0을 반환한다")
    @Test
    void getAccommodationDetail_noReviews() {
        // given
        Long accommodationId = 2L; //리뷰 없는 숙소

        // when
        var dto = accommodationService.getAccommodationDetail(accommodationId);

        // then
        assertThat(dto.getReviews().getComments()).isEmpty();
        assertThat(dto.getReviews().getAvgRating()).isEqualTo(0.0);
    }

}