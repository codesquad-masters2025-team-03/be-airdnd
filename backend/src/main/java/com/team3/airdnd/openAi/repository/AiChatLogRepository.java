package com.team3.airdnd.openAi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.team3.airdnd.openAi.domain.AiChatLog;

public interface AiChatLogRepository extends JpaRepository<AiChatLog, Long> {
	List<AiChatLog> findByUserIdOrderByCreatedAtDesc(Long userId);
}

