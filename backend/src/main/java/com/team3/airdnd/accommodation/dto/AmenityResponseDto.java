package com.team3.airdnd.accommodation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class AmenityResponseDto {

    @AllArgsConstructor
    @Getter
    @Builder
    public static class AmenityInfoDto {
        private Long id;
        private String name;
    }
}
