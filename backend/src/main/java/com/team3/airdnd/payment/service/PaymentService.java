package com.team3.airdnd.payment.service;

import static com.team3.airdnd.payment.dto.PaymentResponseDto.*;

import com.team3.airdnd.payment.domain.Payment;
import com.team3.airdnd.payment.domain.PaymentMethod;
import com.team3.airdnd.payment.dto.PaymentRequestDto;
import com.team3.airdnd.payment.dto.PaymentResponseDto;
import com.team3.airdnd.payment.query.PaymentQueryRepository;
import com.team3.airdnd.payment.repository.PaymentMethodRepository;
import com.team3.airdnd.payment.repository.PaymentRepository;
import com.team3.airdnd.reservation.domain.Reservation;
import com.team3.airdnd.reservation.repository.ReservationRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

	private final PaymentRepository paymentRepository;
	private final PaymentMethodRepository paymentMethodRepository;
	private final ReservationRepository reservationRepository;
	private final PaymentQueryRepository paymentQueryRepository;

	@Value("${toss.secret-key}")
	private String tossSecretKey;

	@Transactional
	public Payment approvePayment(PaymentRequestDto dto) {
		String url = "https://api.tosspayments.com/v1/payments/confirm";
		RestTemplate restTemplate = new RestTemplate();

		String encodedAuth = Base64.getEncoder().encodeToString((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8));
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", "Basic " + encodedAuth);
		headers.setContentType(MediaType.APPLICATION_JSON);

		log.info("tossSecretKey: {}", tossSecretKey);
		log.info("Encoded Authorization: Basic {}", encodedAuth);

		String body = String.format(
			"{\"paymentKey\":\"%s\",\"orderId\":\"%s\",\"amount\":%d}",
			dto.getPaymentKey(), dto.getOrderId(), dto.getAmount()
		);
		HttpEntity<String> request = new HttpEntity<>(body, headers);

		try {
			ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

			if (response.getStatusCode() == HttpStatus.OK) {

				Reservation reservation = reservationRepository.findAll().stream()
					.filter(r -> r.getOrderId().equals(dto.getOrderId()))
					.findFirst()
					.orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));

				PaymentMethod paymentMethod = PaymentMethod.builder()
					.user(reservation.getGuest())
					.methodType(PaymentMethod.MethodType.TOSSPAY)
					.lastFourDigits("0000")
					.isDefault(false)
					.build();

				PaymentMethod savedPaymentMethod = paymentMethodRepository.save(paymentMethod);

				Payment payment = Payment.builder()
					.reservation(reservation)
					.paymentMethod(savedPaymentMethod)
					.orderId(dto.getOrderId())
					.amount(dto.getAmount())
					.paidAt(LocalDateTime.now())
					.build();

				paymentRepository.save(payment);

				reservation.setStatus(Reservation.Status.CONFIRMED);
				reservationRepository.save(reservation);

				return payment;
			} else {
				log.error("토스페이먼츠 결제 승인 실패 응답: {}", response.getBody());
				throw new RuntimeException("토스페이먼츠 결제 승인 실패: " + response.getBody());
			}

		} catch (HttpClientErrorException e) {
			log.error("토스페이먼츠 승인 요청 실패 - 상태코드: {}, 응답: {}", e.getStatusCode(), e.getResponseBodyAsString());
			throw new RuntimeException("토스페이먼츠 API 오류: " + e.getResponseBodyAsString(), e);
		}
	}

	//paymentId로 결제 단건 조회
	public PaymentResponseDto getPaymentById(Long paymentId) {
		Payment payment = paymentRepository.findById(paymentId)
			.orElseThrow(() -> new EntityNotFoundException("해당 결제를 찾을 수 없습니다. ID = " + paymentId));
		return toDto(payment);
	}

	//guestId와 예약 상태에 따른 결제 목록 조회
	public List<Payment> getPaymentsByGuestId(Long guestId, Reservation.Status status) {
		return paymentQueryRepository.findByGuestIdAndOptionalStatus(guestId, status);
	}



}