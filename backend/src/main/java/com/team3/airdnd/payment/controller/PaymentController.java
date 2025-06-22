package com.team3.airdnd.payment.controller;

import com.team3.airdnd.payment.domain.Payment;
import com.team3.airdnd.payment.dto.PaymentRequestDto;
import com.team3.airdnd.payment.dto.PaymentResponseDto;
import com.team3.airdnd.payment.service.PaymentService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

	private final PaymentService paymentService;

	@PostMapping("/approve")
	public ResponseEntity<PaymentResponseDto> approvePayment(@RequestBody PaymentRequestDto paymentRequestDto) {
		Payment payment = paymentService.approvePayment(paymentRequestDto);
		return ResponseEntity.ok(paymentService.toDto(payment));
	}
}