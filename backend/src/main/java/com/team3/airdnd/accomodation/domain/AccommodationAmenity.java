package com.team3.airdnd.accomodation.domain;

import jakarta.persistence.*;
import lombok.*;

import jakarta.persistence.Id;


@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccommodationAmenity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accommodation_id", nullable = false)
    private Accommodation accommodation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amenity_id", nullable = false)
    private Amenity amenity;
}
