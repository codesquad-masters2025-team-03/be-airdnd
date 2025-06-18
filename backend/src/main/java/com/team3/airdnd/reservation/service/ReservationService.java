package com.team3.airdnd.reservation.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.team3.airdnd.accommodation.domain.Accommodation;
import com.team3.airdnd.accommodation.repository.AccommodationRepository;
import com.team3.airdnd.global.exception.CommonException;
import com.team3.airdnd.global.exception.ErrorCode;
import com.team3.airdnd.payment.repository.PaymentRepository;
import com.team3.airdnd.reservation.domain.Reservation;
import com.team3.airdnd.reservation.domain.ReservedDate;
import com.team3.airdnd.reservation.dto.ReservationRequestDto;
import com.team3.airdnd.reservation.dto.ReservationResponseDto;
import com.team3.airdnd.reservation.repository.ReservationRepository;
import com.team3.airdnd.reservation.repository.ReservedDateRepository;
import com.team3.airdnd.user.domain.User;
import com.team3.airdnd.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservationService {

	private final AccommodationRepository accommodationRepository;
	private final UserRepository userRepository;
	private final ReservationRepository reservationRepository;
	private final ReservedDateRepository reservedDateRepository;
	private final PaymentRepository paymentRepository;

	public ReservationResponseDto.CreateReservationResponseDto createReservation(
		ReservationRequestDto.CreateReservationRequestDto request, Long guestId) {

		Accommodation acc = accommodationRepository.findById(request.getAccommodationId())
			.orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_RESOURCE));

		User user = userRepository.findById(guestId)
			.orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_USER));

		validateReservationDate(request.getCheckIn(), request.getCheckOut());
		validateAvailability(acc.getId(), request.getCheckIn(), request.getCheckOut());

		Price price = calculatePrice(acc, request.getCheckIn(), request.getCheckOut());

		Reservation reservation = Reservation.builder()
			.guest(user)
			.accommodation(acc)
			.checkIn(request.getCheckIn())
			.checkOut(request.getCheckOut())
			.guestCount(request.getGuestCount())
			.totalPrice(price.total())
			.serviceFee(price.fee())
			.status(Reservation.Status.PENDING)
			.build();

		reservationRepository.save(reservation);

		return ReservationResponseDto.CreateReservationResponseDto.builder()
			.reservationId(reservation.getId())
			.orderId(reservation.getId().toString())
			.status(reservation.getStatus().name())
			.amount(price.total())
			.build();
	}

	@Transactional
	public void confirmReservation(Long reservationId) {
		Reservation reservation = getReservationOrThrow(reservationId);

		reservation.setStatus(Reservation.Status.CONFIRMED);

		// 예약 날짜 등록
		for (LocalDate d = reservation.getCheckIn(); d.isBefore(reservation.getCheckOut()); d = d.plusDays(1)) {
			reservedDateRepository.save(
				ReservedDate.builder()
					.accommodation(reservation.getAccommodation())
					.reservedDate(d)
					.build()
			);
		}
	}

	@Transactional
	public void cancelReservation(Long reservationId) {
		Reservation reservation = getReservationOrThrow(reservationId);

		//체크아웃 이후면 취소 불가
		if (!reservation.getCheckOut().isAfter(LocalDate.now())) {
			throw new CommonException(ErrorCode.CANNOT_CANCEL_AFTER_CHECKOUT);
		}

		reservation.setStatus(Reservation.Status.CANCELLED);

		// 예약 날짜 삭제
		reservedDateRepository.deleteByAccommodationIdAndDateRange(
			reservation.getAccommodation().getId(),
			reservation.getCheckIn(),
			reservation.getCheckOut().minusDays(1) // exclusive
		);

		// 결제 삭제
		paymentRepository.deleteByReservation(reservation);
	}

	// 예약 유효성 검사 (존재하는 예약인지)
	private Reservation getReservationOrThrow(Long reservationId) {
		return reservationRepository.findById(reservationId)
			.orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_RESERVATION));
	}

	//날짜 유효성 검사 (체크인-체크아웃 순서 검사)
	private void validateReservationDate(LocalDate checkIn, LocalDate checkOut) {
		if (!checkIn.isBefore(checkOut)) {
			throw new CommonException(ErrorCode.INVALID_RESERVATION_DATE_RANGE);
		}
	}

	//예약 가능 날짜 검사
	private void validateAvailability(Long accId, LocalDate checkIn, LocalDate checkOut) {
		List<ReservedDate> conflicts = reservedDateRepository.findOverlappingDates(
			accId, checkIn, checkOut.minusDays(1)
		);
		if (!conflicts.isEmpty()) {
			throw new CommonException(ErrorCode.DUPLICATE_RESERVATION_DATE);
		}
	}

	//금액 계산 (수수료, 총금액)
	private Price calculatePrice(Accommodation acc, LocalDate checkIn, LocalDate checkOut) {
		int days = (int)ChronoUnit.DAYS.between(checkIn, checkOut);
		long totalPrice = days * acc.getPricePerNight();
		long serviceFee = (long)(totalPrice * 0.1); // 수수료 10%
		return new Price(totalPrice, serviceFee);
	}

	private record Price(long total, long fee) {
	}
}
