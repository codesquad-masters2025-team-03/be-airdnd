package com.team3.airdnd.openAi.dto;

import java.util.List;

public record AiRequestDto(String model, List<AiMessage> messages) {
}

