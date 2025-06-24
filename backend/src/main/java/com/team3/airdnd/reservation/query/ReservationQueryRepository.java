package com.team3.airdnd.reservation.query;

import static com.team3.airdnd.accommodation.domain.QAccommodation.*;
import static com.team3.airdnd.reservation.domain.QReservation.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.team3.airdnd.reservation.domain.Reservation;
import com.team3.airdnd.reservation.dto.GuestReservationDto;
import com.team3.airdnd.reservation.dto.QGuestReservationDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ReservationQueryRepository {

	private final JPAQueryFactory queryFactory;


	public List<GuestReservationDto> findConfirmedReservationsByGuestId(Long guestId) {
		return queryFactory
			.select(new QGuestReservationDto(
				reservation.id,
				reservation.orderId,
				accommodation.name,
				reservation.checkIn,
				reservation.checkOut,
				reservation.totalPrice,
				reservation.status
			))
			.from(reservation)
			.join(reservation.accommodation, accommodation)
			.where(
				reservation.guest.id.eq(guestId),
				reservation.status.eq(Reservation.Status.CONFIRMED)
			)
			.fetch();
	}

}
