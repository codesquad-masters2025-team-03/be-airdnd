package com.team3.airdnd.payment.domain;

import java.time.LocalDateTime;

import com.team3.airdnd.reservation.domain.Reservation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	@JoinColumn(name = "reservation_id", nullable = false)
	private Reservation reservation;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "payment_method_id", nullable = false)
	private PaymentMethod paymentMethod;

	@Column(name = "order_id", nullable = false, unique = true, length = 100)
	private String orderId;

	private Long amount; //숙박비 + 수수료

	@Column(name = "paid_at", nullable = false)
	private LocalDateTime paidAt;

	@PrePersist
	public void prePersist() {
		this.paidAt = LocalDateTime.now();
	}

}
