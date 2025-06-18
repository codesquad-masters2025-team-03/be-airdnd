package com.team3.airdnd.reservation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.team3.airdnd.reservation.dto.ReservationRequestDto;
import com.team3.airdnd.reservation.dto.ReservationResponseDto;
import com.team3.airdnd.reservation.service.ReservationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reservations")
public class ReservationController {
	private final ReservationService reservationService;

	// 예약 생성 (PENDING)
	@PostMapping
	public ResponseEntity<ReservationResponseDto.CreateReservationResponseDto> createReservation(
		@RequestBody ReservationRequestDto.CreateReservationRequestDto request,
		@RequestParam("guestId") Long guestId // TODO: 로그인 기능 구현 시 guestId 제거하고 인증 유저로 대체
	) {
		var response = reservationService.createReservation(request, guestId);
		return ResponseEntity.ok(response);
	}
	
	@PatchMapping("/{reservation-id}/confirm")
	public ResponseEntity<String> confirmReservation(
		@PathVariable("reservation-id") Long reservationId
	) {
		reservationService.confirmReservation(reservationId);
		return ResponseEntity.ok(null);
	}
}
