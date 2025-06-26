package com.team3.airdnd.openAi.dto;

import java.util.List;

public record AiResponseDto(List<Choice> choices) {
	public record Choice(AiMessage message) {
	}
}
