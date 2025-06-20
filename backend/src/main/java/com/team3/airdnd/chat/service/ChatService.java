package com.team3.airdnd.chat.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.team3.airdnd.chat.domain.ChatRoom;
import com.team3.airdnd.chat.domain.Message;
import com.team3.airdnd.chat.dto.ChatMessageDto;
import com.team3.airdnd.chat.repository.ChatRoomRepository;
import com.team3.airdnd.user.domain.User;
import com.team3.airdnd.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Transactional
@RequiredArgsConstructor
@Service
public class ChatService {

	private final ChatRoomRepository chatRoomRepository;
	private final ChatMessageRepository chatMessageRepository;
	private final UserRepository userRepository;

	public void saveMessage(ChatMessageDto dto) {
		ChatRoom room = chatRoomRepository.findById(dto.getRoomId())
			.orElseThrow(() -> new RuntimeException("채팅방 없음"));
		User sender = userRepository.findById(dto.getSenderId())
			.orElseThrow(() -> new RuntimeException("유저 없음"));

		Message message = Message.builder()
			.chatRoom(room)
			.sender(sender)
			.content(dto.getContent())
			.sentAt(LocalDateTime.now())
			.build();

		chatMessageRepository.save(message);
	}
}
