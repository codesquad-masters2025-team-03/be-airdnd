package com.team3.airdnd.accommodation.dto;

import com.team3.airdnd.storedFile.dto.ImageUrlDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;


public class AccommodationResponseDto {
    @AllArgsConstructor
    @Getter
    @Builder
    public static class AccommodationDetailDto {
        private String name;
        private List<ImageUrlDto> imageUrls;
        private List<AmenityInfoDto> amenities;
        private Long hostId;
        private String description;
        private long pricePerNight;
        private int maxGuests;
        private int bedCount;
        private AddressInfoDto address;
        private ReviewListDto reviews;
    }

    @AllArgsConstructor
    @Getter
    @Builder
    public static class AddressInfoDto {
        private String city;
        private String district;
        private String streetAddress;
        private double latitude;
        private double longitude;
    }

    @AllArgsConstructor
    @Getter
    @Builder
    public static class ReviewListDto {
        private double avgRating;
        private int reviewSize;
        private List<ReviewInfoDto> comments;
    }
}
