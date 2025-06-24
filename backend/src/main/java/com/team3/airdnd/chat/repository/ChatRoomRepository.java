package com.team3.airdnd.chat.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.team3.airdnd.chat.domain.ChatRoom;
import com.team3.airdnd.reservation.domain.Reservation;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
	Optional<ChatRoom> findByReservationId(Long reservationId);

	boolean existsByReservation(Reservation reservation);
}
