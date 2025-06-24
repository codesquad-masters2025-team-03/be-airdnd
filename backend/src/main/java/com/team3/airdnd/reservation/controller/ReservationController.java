package com.team3.airdnd.reservation.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.team3.airdnd.reservation.dto.GuestReservationDto;
import com.team3.airdnd.reservation.dto.ReservationRequestDto;
import com.team3.airdnd.reservation.dto.ReservationResponseDto;
import com.team3.airdnd.reservation.service.ReservationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reservations")
public class ReservationController {
	private final ReservationService reservationService;

	@GetMapping("/{accommodationId}")
	public ResponseEntity<ReservationResponseDto.ReservationInfoResponseDto> getReservationInfo(
		@PathVariable Long accommodationId,
		@RequestParam LocalDate checkIn,
		@RequestParam LocalDate checkOut
	) {
		return ResponseEntity.ok(
			reservationService.getReservationInfo(accommodationId, checkIn, checkOut)
		);
	}

	// 예약 요청 (PENDING)
	@PostMapping("/{accommodationId}")
	public ResponseEntity<ReservationResponseDto.CreateReservationResponseDto> createReservation(
		@PathVariable Long accommodationId,
		@RequestBody @Valid ReservationRequestDto.CreateReservationRequestDto request,
		@RequestParam("guestId") Long guestId // TODO: 로그인 기능 구현 시 guestId 제거하고 인증 유저로 대체
	) {
		var response = reservationService.createReservation(accommodationId, request, guestId);
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/{reservationId}/confirm")
	public ResponseEntity<String> confirmReservation(
		@PathVariable Long reservationId
	) {
		reservationService.confirmReservation(reservationId);
		return ResponseEntity.ok(null);
	}

	@PatchMapping("/{reservationId}/cancel")
	public ResponseEntity<String> cancelReservation(@PathVariable Long reservationId) {
		reservationService.cancelReservation(reservationId);
		return ResponseEntity.ok(null);
	}

	//게스트 예약 조회
	@GetMapping("/guest/{guestId}/confirmed")
	public List<GuestReservationDto> getConfirmedReservationsByGuest(@PathVariable Long guestId) {
		return reservationService.getConfirmedReservationsByGuest(guestId);
	}

}
