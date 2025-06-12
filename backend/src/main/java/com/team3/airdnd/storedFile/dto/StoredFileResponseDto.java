package com.team3.airdnd.storedFile.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class StoredFileResponseDto {

    @AllArgsConstructor
    @Getter
    @Builder
    public static class ImageUrlDto {
        private Long id;
        private String imageUrl;
    }
}
