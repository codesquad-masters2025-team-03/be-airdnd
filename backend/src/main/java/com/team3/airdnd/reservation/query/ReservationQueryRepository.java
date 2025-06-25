package com.team3.airdnd.reservation.query;

import static com.team3.airdnd.accommodation.domain.QAccommodation.*;
import static com.team3.airdnd.reservation.domain.QReservation.*;
import static com.team3.airdnd.storedFile.domain.QStoredFile.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.team3.airdnd.reservation.domain.Reservation;
import com.team3.airdnd.reservation.dto.GuestReservationDto;
import com.team3.airdnd.reservation.dto.HostReservationDto;

import com.team3.airdnd.reservation.dto.QGuestReservationDto;
import com.team3.airdnd.reservation.dto.QHostReservationDto;
import com.team3.airdnd.storedFile.domain.StoredFile;
import com.team3.airdnd.user.domain.QUser;


import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ReservationQueryRepository {

	private final JPAQueryFactory queryFactory;

	// 게스트의 예약 조회
	public List<GuestReservationDto> findConfirmedReservationsByGuestId(Long guestId) {
		return queryFactory
			.select(new QGuestReservationDto(
				reservation.id,
				reservation.orderId,
				accommodation.name,
				storedFile.fileUrl,
				reservation.checkIn,
				reservation.checkOut,
				reservation.totalPrice,
				reservation.serviceFee,
				reservation.createdAt,
				reservation.status
			))
			.from(reservation)
			.join(reservation.accommodation, accommodation)
			.leftJoin(storedFile)
			.on(
				storedFile.targetType.eq(StoredFile.TargetType.ACCOMMODATION),
				storedFile.targetId.eq(accommodation.id),
				storedFile.fileOrder.eq(1)
			)
			.where(
				reservation.guest.id.eq(guestId),
				reservation.status.eq(Reservation.Status.CONFIRMED)
			)
			.fetch();
	}

	// 호스트의 모든 예약 조회
	public List<HostReservationDto> findReservationsByHostId(Long hostId) {
		QUser guestAlias = new QUser("guest");

		return queryFactory
			.select(new QHostReservationDto(
				reservation.id,
				guestAlias.username,
				reservation.orderId,
				accommodation.name,
				storedFile.fileUrl,
				reservation.checkIn,
				reservation.checkOut,
				reservation.status,
				reservation.serviceFee,
				reservation.totalPrice,
				reservation.createdAt
			))
			.from(reservation)
			.join(reservation.accommodation, accommodation)
			.join(reservation.guest, guestAlias)
			.leftJoin(storedFile)
			.on(
				storedFile.targetType.eq(StoredFile.TargetType.ACCOMMODATION),
				storedFile.targetId.eq(accommodation.id),
				storedFile.fileOrder.eq(1)
			)
			.where(accommodation.host.id.eq(hostId))
			.orderBy(reservation.createdAt.desc())
			.fetch();
	}

	// 호스트의 특정 숙소 예약 조회
	public List<HostReservationDto> findReservationsByHostIdAndAccommodationId(Long hostId, Long accommodationId) {
		QUser guestAlias = new QUser("guest");

		return queryFactory
			.select(new QHostReservationDto(
				reservation.id,
				guestAlias.username,
				reservation.orderId,
				accommodation.name,
				storedFile.fileUrl,
				reservation.checkIn,
				reservation.checkOut,
				reservation.status,
				reservation.serviceFee,
				reservation.totalPrice,
				reservation.createdAt
			))
			.from(reservation)
			.join(reservation.accommodation, accommodation)
			.join(reservation.guest, guestAlias)
			.leftJoin(storedFile)
			.on(
				storedFile.targetType.eq(StoredFile.TargetType.ACCOMMODATION),
				storedFile.targetId.eq(accommodation.id),
				storedFile.fileOrder.eq(1)
			)
			.where(
				accommodation.host.id.eq(hostId),
				accommodation.id.eq(accommodationId)
			)
			.orderBy(reservation.createdAt.desc())
			.fetch();
	}
}
