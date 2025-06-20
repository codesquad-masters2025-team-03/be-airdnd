package com.team3.airdnd.accommodation.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder(toBuilder = true)
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Address {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String city;

	private String district;

	@Column(name = "street_address")
	private String streetAddress;

	@Column(name = "detail_address")
	private String detailAddress;

	@Column(nullable = false)
	private Double latitude;

	@Column(nullable = false)
	private Double longitude;
}
