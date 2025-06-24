package com.team3.airdnd.review;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team3.airdnd.global.dto.ResponseDto;
import com.team3.airdnd.review.dto.ReviewRequestDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {

	private final ReviewService reviewService;

	@PostMapping
	public ResponseEntity<ResponseDto<Void>> createReview(@RequestBody @Valid ReviewRequestDto request) {
		reviewService.createReview(request);
		return ResponseDto.ok(null);
	}

	@DeleteMapping("/{reviewId}")
	public ResponseEntity<ResponseDto<Void>> deleteReview(@PathVariable Long reviewId) {
		reviewService.deleteReview(reviewId);
		return ResponseDto.ok(null);
	}
}
