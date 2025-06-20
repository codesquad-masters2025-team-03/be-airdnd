package com.team3.airdnd.accommodation.query;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.team3.airdnd.accommodation.domain.Accommodation;
import com.team3.airdnd.accommodation.domain.QAccommodation;
import com.team3.airdnd.accommodation.domain.QAccommodationAmenity;
import com.team3.airdnd.accommodation.domain.QAddress;
import com.team3.airdnd.accommodation.domain.QAmenity;
import com.team3.airdnd.accommodation.dto.AccommodationListConditionDto;
import com.team3.airdnd.accommodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accommodation.dto.AmenityDto;
import com.team3.airdnd.accommodation.dto.BaseSearchConditionDto;
import com.team3.airdnd.accommodation.dto.PriceHistogramConditionDto;
import com.team3.airdnd.reservation.domain.QReservation;
import com.team3.airdnd.reservation.domain.Reservation;
import com.team3.airdnd.storedFile.domain.QStoredFile;
import com.team3.airdnd.storedFile.domain.StoredFile;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AccommodationQueryRepository {

	@PersistenceContext
	private EntityManager em;

	private final JPAQueryFactory queryFactory;

	private final QAccommodation accommodation = QAccommodation.accommodation;
	private final QAccommodationAmenity accommodationAmenity = QAccommodationAmenity.accommodationAmenity;
	private final QAmenity amenity = QAmenity.amenity;
	private final QStoredFile storedFile = QStoredFile.storedFile;
	private final QReservation reservation = QReservation.reservation;
	private final QAddress address = QAddress.address;

	public List<Integer> findAvailableAccommodationPrices(PriceHistogramConditionDto request) {
		BooleanBuilder condition = createSearchCondition(request);
		BooleanExpression noOverlap = createNoOverlapCondition(request);

		return queryFactory
			.select(accommodation.pricePerNight)
			.from(accommodation)
			.join(accommodation.address, address)
			.where(condition.and(noOverlap))
			.fetch();
	}

	public AccommodationResponseDto.AccommodationListDto findAccommodationListWithFilter(
		AccommodationListConditionDto request, int page, int size) {

		PageRequest pageRequest = PageRequest.of(page - 1, size);

		// 기존 검색 조건
		BooleanBuilder condition = createSearchCondition(request);

		// 요금 조건
		if (request.hasValidPriceRange()) {
			condition.and(accommodation.pricePerNight.between(request.getMinPrice(), request.getMaxPrice()));
		}

		// 예약 겹침 조건
		BooleanExpression noOverlap = createNoOverlapCondition(request);

		// 지도 범위 조건
		BooleanExpression boundsCondition = createBoundsCondition(
			request.getNorthEastLat(), request.getNorthEastLng(),
			request.getSouthWestLat(), request.getSouthWestLng()
		);

		BooleanBuilder finalCondition = new BooleanBuilder(condition)
			.and(noOverlap);

		if (boundsCondition != null) {
			finalCondition.and(boundsCondition);
		}

		// 숙소 목록 조회
		List<Accommodation> accommodations = queryFactory
			.selectFrom(accommodation)
			.join(accommodation.address, address).fetchJoin()
			.where(finalCondition)
			.offset(pageRequest.getOffset())
			.limit(pageRequest.getPageSize())
			.fetch();

		// 총 개수 조회
		long total = queryFactory
			.select(accommodation.count())
			.from(accommodation)
			.join(accommodation.address, address)
			.where(finalCondition)
			.fetchOne();

		// 추가 정보 매핑
		List<Long> accommodationIds = accommodations.stream().map(Accommodation::getId).toList();
		Map<Long, String> imageMap = fetchImageMap(accommodationIds);
		Map<Long, List<AmenityDto>> amenityMap = fetchAmenityMap(accommodationIds);

		// DTO 변환
		List<AccommodationResponseDto.AccommodationInfo> accommodationInfos = accommodations.stream()
			.map(acc -> {
				String imageUrl = imageMap.getOrDefault(acc.getId(), null);
				List<AmenityDto> amenities = amenityMap.getOrDefault(acc.getId(), Collections.emptyList());
				return AccommodationResponseDto.AccommodationInfo.builder()
					.id(acc.getId())
					.name(acc.getName())
					.imageUrl(imageUrl)
					.pricePerNight(acc.getPricePerNight())
					.description(acc.getDescription())
					.maxGuests(acc.getMaxGuests())
					.bedCount(Optional.ofNullable(acc.getBedCount()).orElse(0))
					.address(acc.getAddress().getCity() + " "
						+ acc.getAddress().getDistrict() + " "
						+ acc.getAddress().getStreetAddress())
					.amenity(amenities)
					.latitude(acc.getAddress().getLatitude())
					.longitude(acc.getAddress().getLongitude())
					.build();
			})
			.toList();

		// 최종 응답
		return AccommodationResponseDto.AccommodationListDto.builder()
			.page(page)
			.size(size)
			.totalPages((int)Math.ceil((double)total / size))
			.totalElements((int)total)
			.accommodations(accommodationInfos)
			.build();
	}

	private BooleanBuilder createSearchCondition(BaseSearchConditionDto request) {
		BooleanBuilder condition = new BooleanBuilder();

		if (request.isLocationValid()) {
			condition.and(
				address.city.containsIgnoreCase(request.getLocation())
					.or(address.district.containsIgnoreCase(request.getLocation()))
					.or(address.streetAddress.containsIgnoreCase(request.getLocation()))
					.or(accommodation.name.containsIgnoreCase(request.getLocation()))
			);
		}

		if (request.isGuestsValid()) {
			condition.and(accommodation.maxGuests.goe(request.getGuests()));
		}
		return condition;
	}

	private BooleanExpression createNoOverlapCondition(BaseSearchConditionDto request) {
		return JPAExpressions
			.selectOne()
			.from(reservation)
			.where(
				reservation.accommodation.eq(accommodation)
					.and(reservation.status.in(Reservation.Status.CONFIRMED, Reservation.Status.PENDING))
					.and(reservation.checkOut.gt(request.getCheckIn()))
					.and(reservation.checkIn.lt(request.getCheckOut()))
			)
			.notExists();
	}

	private Map<Long, String> fetchImageMap(List<Long> accommodationIds) {
		List<Tuple> imageTuples = queryFactory
			.select(storedFile.targetId, storedFile.fileUrl)
			.from(storedFile)
			.where(
				storedFile.targetType.eq(StoredFile.TargetType.ACCOMMODATION)
					.and(storedFile.targetId.in(accommodationIds))
					.and(storedFile.fileOrder.eq(1))
			)
			.fetch();

		return imageTuples.stream()
			.collect(Collectors.toMap(
				t -> t.get(storedFile.targetId),
				t -> t.get(storedFile.fileUrl)
			));
	}

	private Map<Long, List<AmenityDto>> fetchAmenityMap(List<Long> accommodationIds) {
		List<Tuple> amenityTuples = queryFactory
			.select(accommodationAmenity.accommodation.id, amenity.id, amenity.name)
			.from(accommodationAmenity)
			.join(accommodationAmenity.amenity, amenity)
			.where(accommodationAmenity.accommodation.id.in(accommodationIds))
			.fetch();

		Map<Long, List<AmenityDto>> amenityMap = new HashMap<>();
		for (Tuple tuple : amenityTuples) {
			Long accId = tuple.get(accommodationAmenity.accommodation.id);
			AmenityDto dto = new AmenityDto(tuple.get(amenity.id), tuple.get(amenity.name));
			amenityMap.computeIfAbsent(accId, k -> new ArrayList<>()).add(dto);
		}
		return amenityMap;
	}

	private BooleanExpression createBoundsCondition(Double neLat, Double neLng, Double swLat, Double swLng) {
		if (neLat == null || neLng == null || swLat == null || swLng == null) {
			return null;
		}

		return address.latitude.between(swLat, neLat)
			.and(address.longitude.between(swLng, neLng));
	}
}
