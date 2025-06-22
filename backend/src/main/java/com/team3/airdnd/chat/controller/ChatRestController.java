package com.team3.airdnd.chat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team3.airdnd.chat.dto.ChatMessageResponseDto;
import com.team3.airdnd.chat.service.ChatService;
import com.team3.airdnd.global.dto.ResponseDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatRestController {

	private final ChatService chatService;

	@GetMapping("/accommodations/{accommodationId}/messages")
	public ResponseEntity<ResponseDto<List<ChatMessageResponseDto>>> getMessages(@PathVariable Long accommodationId) {
		List<ChatMessageResponseDto> messages = chatService.getMessageList(accommodationId);
		return ResponseDto.ok(messages);
	}
}
