package com.team3.airdnd.accommodation.repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.team3.airdnd.accommodation.domain.Accommodation;

import com.team3.airdnd.accommodation.domain.QAccommodation;
import com.team3.airdnd.accommodation.domain.QAccommodationAmenity;
import com.team3.airdnd.accommodation.domain.QAmenity;
import com.team3.airdnd.accommodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accommodation.dto.AmenityInfoDto;

import com.team3.airdnd.storedFile.domain.QStoredFile;
import com.team3.airdnd.storedFile.domain.StoredFile;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class AccommodationQueryRepositoryImpl implements AccommodationQueryRepository {

	private final JPAQueryFactory queryFactory;

	private final QAccommodation accommodation = QAccommodation.accommodation;
	private final QAccommodationAmenity accommodationAmenity = QAccommodationAmenity.accommodationAmenity;
	private final QAmenity amenity = QAmenity.amenity;
	private final QStoredFile storedFile = QStoredFile.storedFile;

	@Override
	public  AccommodationResponseDto.AccommodationListDto getAccommodationListByPage(int page, int size) {
		PageRequest pageRequest = PageRequest.of(page - 1, size);

		// 1. 페이징된 숙소 가져오기
		List<Accommodation> accommodations = queryFactory
			.selectFrom(accommodation)
			.offset(pageRequest.getOffset())
			.limit(pageRequest.getPageSize())
			.fetch();

		long total = queryFactory
			.select(accommodation.count())
			.from(accommodation)
			.fetchOne();

		List<Long> accommodationIds = accommodations.stream()
			.map(Accommodation::getId)
			.toList();

		// 2. 대표 이미지 조회
		List<Tuple> imageTuples = queryFactory
			.select(storedFile.targetId, storedFile.fileUrl)
			.from(storedFile)
			.where(storedFile.targetType.eq(StoredFile.TargetType.ACCOMMODATION)
				.and(storedFile.targetId.in(accommodationIds))
				.and(storedFile.fileOrder.eq(1)))
			.fetch();

		Map<Long, String> imageMap = imageTuples.stream()
			.collect(Collectors.toMap(
				t -> t.get(storedFile.targetId),
				t -> t.get(storedFile.fileUrl)
			));

		// 3. Amenity 목록 조회
		List<Tuple> amenityTuples = queryFactory
			.select(accommodationAmenity.accommodation.id, amenity.id, amenity.name)
			.from(accommodationAmenity)
			.join(accommodationAmenity.amenity, amenity)
			.where(accommodationAmenity.accommodation.id.in(accommodationIds))
			.fetch();

		Map<Long, List<AmenityInfoDto>> amenityMap = new HashMap<>();
		for (Tuple tuple : amenityTuples) {
			Long accId = tuple.get(accommodationAmenity.accommodation.id);
			AmenityInfoDto dto = new AmenityInfoDto(
				tuple.get(amenity.id),
				tuple.get(amenity.name)
			);
			amenityMap.computeIfAbsent(accId, k -> new ArrayList<>()).add(dto);
		}

		// 4. AccommodationInfo 조립
		List<AccommodationResponseDto.AccommodationInfo> accommodationInfos = accommodations.stream()
			.map(acc -> {
				String imageUrl = imageMap.getOrDefault(acc.getId(), null);
				List<AmenityInfoDto> amenities = amenityMap.getOrDefault(acc.getId(), Collections.emptyList());
				return AccommodationResponseDto.AccommodationInfo.builder()
					.id(acc.getId())
					.name(acc.getName())
					.imageUrl(imageUrl)
					.pricePerNight(acc.getPricePerNight())
					.description(acc.getDescription())
					.maxGuests(acc.getMaxGuests())
					.bedCount(acc.getBedCount() != null ? acc.getBedCount() : 0)
					.address(
						acc.getAddress().getCity() + " " +
							acc.getAddress().getDistrict() + " " +
							acc.getAddress().getStreetAddress()
					)
					.amenity(amenities)
					.latitude(acc.getAddress().getLatitude())
					.longitude(acc.getAddress().getLongitude())
					.build();
			})
			.collect(Collectors.toList());

		return AccommodationResponseDto.AccommodationListDto.builder()
			.page(page)
			.size(size)
			.totalPages((int) Math.ceil((double) total / size))
			.totalElements((int) total)
			.accommodations(accommodationInfos)
			.build();
	}


}
