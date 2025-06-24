package com.team3.airdnd.chat.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.team3.airdnd.chat.dto.ChatMessageDto;
import com.team3.airdnd.chat.service.ChatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Controller //HTTP 요청이 아니라 STOMP WebSocket 메시지 처리용 어노테이션
public class ChatController {

	private final ChatService chatService;

	@MessageMapping("/chat/message") // /pub/chat/message 로 요청 들어옴
	@SendTo("/sub/chat/accommodation/{accommodationId}") // 이걸 구독하고 있는 클라이언트에게 보냄
	public ChatMessageDto sendMessage(ChatMessageDto message) {
		chatService.saveMessage(message);
		return message;
	}
}
