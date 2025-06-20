package com.team3.airdnd.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class ChatMessageDto {
	private Long accommodationId;
	private Long senderId;
	private String content;
}
