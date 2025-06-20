package com.team3.airdnd.accommodation.domain;

import com.team3.airdnd.user.domain.User;

import java.time.LocalDateTime;

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
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Accommodation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@NotNull
	@Column(name = "price_per_night", nullable = false)
	private Integer pricePerNight;

	@Column(length = 500)
	private String description;

	@NotNull
	@Column(name = "max_guests")
	private Integer maxGuests;

	@NotNull
	@Column(name = "bed_count")
	private Integer bedCount;

	@NotNull
	@Column(name = "room_count")
	private Integer roomCount;

	@OneToOne
	@JoinColumn(name = "address_id", unique = true)
	private Address address;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@PrePersist
	public void prePersist() {
		this.createdAt = LocalDateTime.now();
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "host_id", nullable = false)
	private User host;

}
