package com.team3.airdnd.accommodation.dto;

import java.time.LocalDateTime;

public record ReviewInfoDto(
        Long commentId,
        String content,
        LocalDateTime createdAt,
        Long guestId,
        String guestName,
        String profileUrl,
        double rating
) {}