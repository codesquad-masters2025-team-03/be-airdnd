package com.team3.airdnd.openAi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team3.airdnd.openAi.domain.AiChatLog;
import com.team3.airdnd.openAi.service.AiChatService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class AiChatController {
	private final AiChatService aiChatService;

	@PostMapping("")
	public ResponseEntity<Map<String, String>> chat(
		@RequestBody Map<String, String> request,
		HttpServletRequest httpRequest
	) {
		String question = request.get("message");
		Long userId = (Long)httpRequest.getAttribute("userId"); // 인터셉터로 설정된 로그인 사용자 ID

		String answer = aiChatService.askAndSave(userId, question);
		return ResponseEntity.ok(Map.of("reply", answer));
	}

	@GetMapping("/logs")
	public ResponseEntity<List<AiChatLog>> getLogs(
		HttpServletRequest request
	) {
		Long userId = (Long)request.getAttribute("userId");
		return ResponseEntity.ok(aiChatService.getLogs(userId));
	}

}

