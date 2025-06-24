package com.team3.airdnd.review;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.team3.airdnd.AbstractIntegrationTest;
import com.team3.airdnd.MockAwsConfig;
import com.team3.airdnd.global.exception.CommonException;
import com.team3.airdnd.global.exception.ErrorCode;
import com.team3.airdnd.review.dto.ReviewRequestDto;
import com.team3.airdnd.review.repository.ReviewRepository;

@Transactional
@SpringBootTest
@ActiveProfiles("test")
@Import(MockAwsConfig.class)
public class ReviewServiceTest extends AbstractIntegrationTest {

	@Autowired
	private ReviewService reviewService;

	@Autowired
	private ReviewRepository reviewRepository;

	@Test
	@DisplayName("리뷰_정상_생성")
	void 리뷰_정상_생성() {
		// given
		ReviewRequestDto request = new ReviewRequestDto(26L, "테스트 리뷰", 5.0);

		// when
		reviewService.createReview(request);

		// then
		assertThat(reviewRepository.existsByReservationId(1L)).isTrue();
	}

	@Test
	@DisplayName("리뷰_중복작성_예외")
	void 리뷰_중복작성_예외() {
		// given: 이미 ID 1번 예약에 리뷰가 존재 (review-test-data.sql 참고)
		ReviewRequestDto request = new ReviewRequestDto(1L, "중복 리뷰", 4.0);

		// when & then
		CommonException ex = assertThrows(CommonException.class, () -> reviewService.createReview(request));
		assertThat(ex.getErrorCode()).isEqualTo(ErrorCode.ALREADY_WRITTEN_REVIEW);
	}

	@Test
	@DisplayName("리뷰_삭제_정상")
	void 리뷰_삭제_정상() {
		// given
		Long reviewId = 1L;

		// when
		reviewService.deleteReview(reviewId);

		// then
		Optional<com.team3.airdnd.review.domain.Review> deleted = reviewRepository.findById(reviewId);
		assertThat(deleted).isEmpty();
	}

	@Test
	@DisplayName("리뷰_삭제시_없는_리뷰면_예외")
	void 리뷰_삭제시_없는_리뷰면_예외() {
		// when & then
		CommonException ex = assertThrows(CommonException.class, () -> reviewService.deleteReview(999L));
		assertThat(ex.getErrorCode()).isEqualTo(ErrorCode.NOT_FOUND_REVIEW);
	}

}