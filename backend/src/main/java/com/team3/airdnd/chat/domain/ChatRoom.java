package com.team3.airdnd.chat.domain;

import java.time.LocalDateTime;

import com.team3.airdnd.reservation.domain.Reservation;
import com.team3.airdnd.user.domain.User;

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
public class ChatRoom {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "host_id", nullable = false)
	private User host;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "guest_id", nullable = false)
	private User guest;

	@OneToOne
	@JoinColumn(name = "reservation_id")
	private Reservation reservation;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "last_message", length = 500)
	private String lastMessage;

	@Column(name = "last_message_at")
	private LocalDateTime lastMessageAt;

	@PrePersist
	public void prePersist() {
		this.createdAt = LocalDateTime.now();
	}
}
