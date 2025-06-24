package com.team3.airdnd.chat.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.team3.airdnd.chat.domain.ChatRoom;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

	// 예약 ID 기준으로 채팅방 찾기
	Optional<ChatRoom> findByReservationId(Long reservationId);
}
