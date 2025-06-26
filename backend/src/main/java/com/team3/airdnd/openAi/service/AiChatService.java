package com.team3.airdnd.openAi.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.team3.airdnd.openAi.domain.AiChatLog;
import com.team3.airdnd.openAi.dto.AiMessage;
import com.team3.airdnd.openAi.dto.AiRequestDto;
import com.team3.airdnd.openAi.dto.AiResponseDto;
import com.team3.airdnd.openAi.repository.AiChatLogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiChatService {
	private final WebClient openAiWebClient;
	private final AiChatLogRepository chatLogRepository;

	private static final String SYSTEM_PROMPT =
		"너는 친절하고 실용적인 국내 여행 전문 여행사 직원이야. " +
			"사용자의 질문에 맞는 국내 여행지를 2~3곳 정도 추천해줘. " +
			"각 추천지는 번호나 리스트 형식으로 정리하고, 각 지역의 특색과 사용자의 질문 의도에 맞는 이유를 자세하게 설명해. " +
			"만약 사용자가 '어디를 가야 할까?'가 아니라, '거기서 뭘 하면 좋을까', '일정을 어떻게 짜면 좋을까' 같은 질문을 해도 친절하고 실용적으로 답해줘. " +
			"각 지역에 어울리는 이모지(예: 🏖️, 🏞️, 🏯, 🧒 등)도 적절하게 한두 개씩만 넣어줘. " +
			"불필요하게 긴 인삿말이나 마무리 멘트는 하지 마. " +
			"사용자 질문이 애매하면 일반적인 국내 가족 여행지를 추천해.";

	@Value("${openai.model}")
	private String model;

	public String ask(String question) {
		List<AiMessage> messages = List.of(
			new AiMessage("system", "너는 친절한 여행사 직원이야."),
			new AiMessage("user", question)
		);
		AiRequestDto request = new AiRequestDto(model, messages);

		AiResponseDto response = openAiWebClient.post()
			.bodyValue(request)
			.retrieve()
			.bodyToMono(AiResponseDto.class)
			.block();

		return response.choices().get(0).message().content();
	}

	public String askAndSave(Long userId, String question) {
		List<AiMessage> messages = List.of(
			new AiMessage("system", SYSTEM_PROMPT),
			new AiMessage("user", question)
		);

		AiRequestDto request = new AiRequestDto(model, messages);

		AiResponseDto response = openAiWebClient.post()
			.bodyValue(request)
			.retrieve()
			.bodyToMono(AiResponseDto.class)
			.block();

		String answer = response.choices().get(0).message().content();

		chatLogRepository.save(AiChatLog.builder()
			.userId(userId)
			.question(question)
			.answer(answer)
			.createdAt(LocalDateTime.now())
			.build()
		);

		return answer;
	}

	public List<AiChatLog> getLogs(Long userId) {
		return chatLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
	}
}