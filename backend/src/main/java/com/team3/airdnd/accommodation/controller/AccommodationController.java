package com.team3.airdnd.accommodation.controller;

import com.team3.airdnd.accommodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accommodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accommodation.service.AccommodationService;
import com.team3.airdnd.global.dto.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.team3.airdnd.accommodation.dto.AccommodationRequestDto;
import com.team3.airdnd.accommodation.service.AccommodationService;
import jakarta.validation.Valid;
import com.team3.airdnd.accommodation.dto.PriceHistogramRequestDto;
import com.team3.airdnd.accommodation.service.AccommodationService;
import com.team3.airdnd.global.dto.ResponseDto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/accommodations")
public class AccommodationController {

    private final AccommodationService accommodationService;

	@GetMapping("/{accommodation-id}")
	public ResponseEntity<ResponseDto<AccommodationResponseDto.AccommodationDetailDto>> getAccommodationDetail(
		@PathVariable("accommodation-id") Long id) {
		AccommodationResponseDto.AccommodationDetailDto detailDto = accommodationService.getAccommodationDetail(id);
		return ResponseDto.ok(detailDto);
	}

	@PostMapping("/create")
	public ResponseEntity<ResponseDto<Void>> createAccommodation(
		@RequestBody @Valid AccommodationRequestDto.CreateAccommodationDto request) {
		accommodationService.createAccommodation(request);
		return ResponseDto.created();
	}

	@PatchMapping("/{accommodation-id}")
	public ResponseEntity<ResponseDto<Void>> updateAccommodation(
		@PathVariable("accommodation-id") Long accommodationId,
		@RequestBody AccommodationRequestDto.UpdateAccommodationDto request,
		@RequestParam Long hostId
	) {
		accommodationService.updateAccommodation(accommodationId, request, hostId);
		return ResponseDto.ok(null);
	}

	@DeleteMapping("/{accommodation-id}")
	public ResponseEntity<ResponseDto<Void>> deleteAccommodation(
		@PathVariable("accommodation-id") Long accommodationId,
		@RequestParam Long hostId
	) {
		accommodationService.deleteAccommodation(accommodationId, hostId);
		return ResponseDto.noContent();
	}

	@GetMapping("/{accommodation-id}")
	public ResponseDto<AccommodationResponseDto.AccommodationDetailDto> getAccommodationDetail(
		@PathVariable("accommodation-id") Long id) {
		AccommodationResponseDto.AccommodationDetailDto detailDto = accommodationService.getAccommodationDetail(id);
		return ResponseDto.ok(detailDto);
	}

	@GetMapping("/price-range")
	public ResponseDto<?> getAccommodationPriceRange(@Valid @ModelAttribute PriceHistogramRequestDto request) {
		return ResponseDto.ok(accommodationService.getPriceHistogram(request));
	}

	//속소 목록 페이징 조회 기능
	@GetMapping("")
	public ResponseDto<AccommodationResponseDto.AccommodationListDto> getAccommodationList(
		@RequestParam(required = false, defaultValue = "1") int page,
		@RequestParam(required = false, defaultValue = "5") int size
	){
		AccommodationResponseDto.AccommodationListDto accommodations = accommodationService.getAccommodations(page, size);
		return ResponseDto.ok(accommodations);
	}


}
