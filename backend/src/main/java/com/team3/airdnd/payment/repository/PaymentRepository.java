package com.team3.airdnd.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.team3.airdnd.payment.domain.Payment;
import com.team3.airdnd.reservation.domain.Reservation;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
	void deleteByReservation(Reservation reservation);
}