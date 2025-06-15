package com.team3.airdnd.accommodation.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import com.team3.airdnd.accommodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accommodation.service.AccommodationService;
import com.team3.airdnd.global.dto.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.team3.airdnd.accommodation.dto.AccommodationRequestDto;
import com.team3.airdnd.accommodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accommodation.dto.PriceHistogramRequestDto;
import com.team3.airdnd.accommodation.dto.PriceHistogramResponseDto;
import com.team3.airdnd.accommodation.service.AccommodationService;
import com.team3.airdnd.global.dto.ResponseDto;
import com.team3.airdnd.global.exception.CommonException;
import com.team3.airdnd.global.exception.ErrorCode;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

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
		@RequestPart @Valid AccommodationRequestDto.CreateAccommodationDto request,
		@RequestPart("files") List<MultipartFile> files) {
		if (files == null || files.size() < 1 || files.size() > 5) {
			throw new CommonException(ErrorCode.INVALID_IMAGE);
		}

		accommodationService.createAccommodation(request, files);
		return ResponseDto.created();
	}

	@PatchMapping("/{accommodation-id}")
	public ResponseEntity<ResponseDto<Void>> updateAccommodation(
		@PathVariable("accommodation-id") Long accommodationId,
		@RequestPart AccommodationRequestDto.UpdateAccommodationDto request,
		@RequestParam Long hostId,
		@RequestPart(value = "files", required = false) List<MultipartFile> files
	) {
		if (files != null) {
			if (files.size() < 1 || files.size() > 5) {
				throw new CommonException(ErrorCode.INVALID_IMAGE);
			}
		}

		accommodationService.updateAccommodation(accommodationId, request, hostId, files);
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

	@GetMapping("/price-range")
	public ResponseDto<?> getAccommodationPriceRange(
		@Valid @ModelAttribute PriceHistogramRequestDto request
	) {
		return ResponseDto.ok(accommodationService.getPriceHistogram(request));
	}

	//속소 목록 페이징 조회 기능
	@GetMapping("")
	public ResponseEntity<ResponseDto<AccommodationResponseDto.AccommodationListDto>> getAccommodationList(
		@RequestParam(required = false, defaultValue = "1") int page,
		@RequestParam(required = false, defaultValue = "5") int size
	) {
		AccommodationResponseDto.AccommodationListDto accommodations = accommodationService.getAccommodations(page,
			size);
		return ResponseDto.ok(accommodations);
	}

	@GetMapping("/host")
	public ResponseEntity<ResponseDto<Map<String, Object>>> getMyAccommodations(@RequestParam Long hostId) {
		List<AccommodationResponseDto.HostAccommodationDto> accommodations = accommodationService.getMyAccommodations(
			hostId);

		Map<String, Object> data = Map.of("accommodations", accommodations);
		return ResponseDto.ok(data);
	}
}
