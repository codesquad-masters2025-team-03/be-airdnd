package com.team3.airdnd.accommodation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

public class ReviewResponseDto {

    @AllArgsConstructor
    @Getter
    @Builder
    public static class ReviewListDto {
        private double avgRating;
        private int reviewSize;
        private List<ReviewInfoDto> comments;
    }

    @AllArgsConstructor
    @Getter
    @Builder
    public static class ReviewInfoDto {
        private Long commentId;
        private String content;
        private LocalDateTime createdAt;
        private Long guestId;
        private String guestName;
        private String profileUrl;
        private double rating;
    }
}
