package com.team3.airdnd.accommodation.domain;

import com.team3.airdnd.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import jakarta.persistence.Id;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Accommodation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "price_per_night", nullable = false)
    private Integer pricePerNight;

    @Column(length = 500)
    private String description;

    @Column(name = "max_guests")
    private Integer maxGuests;

    @Column(name = "bed_count")
    private Integer bedCount;

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
