package com.team3.airdnd.reservation.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;

import com.team3.airdnd.accommodation.domain.Accommodation;
import com.team3.airdnd.user.domain.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Reservation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "guest_id", nullable = false)
	private User guest;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "accommodation_id", nullable = false)
	private Accommodation accommodation;

	@Column(name = "order_id", nullable = false, unique = true, length = 100)
	private String orderId;

	@Column(name = "check_in", nullable = false)
	private LocalDate checkIn;

	@Column(name = "check_out", nullable = false)
	private LocalDate checkOut;

	@Column(name = "guest_count", nullable = false)
	private Integer guestCount;

	@Enumerated(EnumType.STRING)
	private Status status;

	@Column(name = "service_fee", nullable = false)
	private Long serviceFee;

	@Column(name = "total_price", nullable = false)
	private Long totalPrice; //순수 숙박비

	@CreatedDate
	@Column(name = "created_at")
	private LocalDateTime createdAt;

	public enum Status {
		PENDING, CONFIRMED, CANCELLED
	}
}
