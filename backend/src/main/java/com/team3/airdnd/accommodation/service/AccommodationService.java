package com.team3.airdnd.accommodation.service;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.team3.airdnd.accommodation.domain.Accommodation;
import com.team3.airdnd.accommodation.domain.AccommodationAmenity;
import com.team3.airdnd.accommodation.domain.Address;
import com.team3.airdnd.accommodation.domain.QAccommodation;
import com.team3.airdnd.accommodation.domain.QReservation;
import com.team3.airdnd.accommodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accommodation.dto.AmenityInfoDto;
import com.team3.airdnd.accommodation.dto.PriceHistogramRequestDto;
import com.team3.airdnd.accommodation.dto.PriceHistogramResponseDto;
import com.team3.airdnd.accommodation.dto.ReviewInfoDto;
import com.team3.airdnd.accommodation.repository.AccommodationAmenityRepository;
import com.team3.airdnd.accommodation.repository.AccommodationRepository;
import com.team3.airdnd.accommodation.repository.ReviewRepository;
import com.team3.airdnd.global.exception.CommonException;
import com.team3.airdnd.global.exception.ErrorCode;
import com.team3.airdnd.storedFile.domain.StoredFile;
import com.team3.airdnd.storedFile.dto.ImageUrlDto;
import com.team3.airdnd.storedFile.repository.StoredFileRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccommodationService {

    private final AccommodationRepository accommodationRepository;
    private final StoredFileRepository storedFileRepository;
    private final AccommodationAmenityRepository accommodationAmenityRepository;
    private final ReviewRepository reviewRepository;
	private final JPAQueryFactory queryFactory;

    public AccommodationResponseDto.AccommodationDetailDto getAccommodationDetail(Long id) {
        Accommodation accommodation = findAccommodationOrThrow(id);
        List<ImageUrlDto> imageUrls = findAllImageUrlsByAccommodationId(id);
        List<AmenityInfoDto> amenities = findAmenityNamesByAccommodationId(id);
        AccommodationResponseDto.ReviewListDto reviewLists = buildReviewLists(id);
        AccommodationResponseDto.AddressInfoDto address = buildAddress(accommodation.getAddress());

        return AccommodationResponseDto.AccommodationDetailDto.builder()
                .name(accommodation.getName())
                .imageUrls(imageUrls)
                .amenities(amenities)
                .hostId(accommodation.getHost().getId())
                .description(accommodation.getDescription())
                .pricePerNight(accommodation.getPricePerNight())
                .maxGuests(accommodation.getMaxGuests())
                .bedCount(accommodation.getBedCount())
                .address(address)
                .reviews(reviewLists)
                .build();
    }

    private Accommodation findAccommodationOrThrow(Long id) {
        return accommodationRepository.findDetailById(id)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_RESOURCE));
    }

    private List<ImageUrlDto> findAllImageUrlsByAccommodationId(Long id) {
        return storedFileRepository.findImageByTargetTypeAndTargetIdOrderByFileOrderAsc(
                StoredFile.TargetType.ACCOMMODATION, id);
    }
    private List<AmenityInfoDto> findAmenityNamesByAccommodationId(Long id) {
        return accommodationAmenityRepository.findAmenityByAccommodationId(id);
    }

    private AccommodationResponseDto.ReviewListDto buildReviewLists(Long id) {
        List<ReviewInfoDto> reviews = reviewRepository.findReviewByAccommodationId(id);

        double avg = reviews.stream()
                .mapToDouble(ReviewInfoDto::rating)
                .average()
                .orElse(0.0);

        return AccommodationResponseDto.ReviewListDto.builder()
                .avgRating(avg)
                .reviewSize(reviews.size())
                .comments(reviews)
                .build();
    }

    private AccommodationResponseDto.AddressInfoDto buildAddress(Address address) {
        return new AccommodationResponseDto.AddressInfoDto(
                address.getCity(),
                address.getDistrict(),
                address.getStreetAddress(),
                address.getLatitude(),
                address.getLongitude()
        );
    }

	public PriceHistogramResponseDto getPriceHistogram(PriceHistogramRequestDto request) {
		QAccommodation a = QAccommodation.accommodation;
		QReservation r = QReservation.reservation;

		final int binCount = 50;

		// 예약 겹침 없는 숙소만
		BooleanExpression noOverlap = JPAExpressions
			.selectOne()
			.from(r)
			.where(
				r.accommodation.eq(a),
				r.checkIn.lt(request.checkOut()),
				r.checkOut.gt(request.checkIn())
				//                r.status.eq(ReservationStatus.RESERVED)
			)
			.notExists();

		// 지역, 인원 조건
		BooleanBuilder condition = new BooleanBuilder();
		if (request.location() != null && !request.location().isBlank()) {
			condition.and(
				a.address.city.containsIgnoreCase(request.location())
					.or(a.address.district.containsIgnoreCase(request.location()))
					.or(a.address.streetAddress.containsIgnoreCase(request.location()))
			);
		}
		if (request.guests() != null) {
			condition.and(a.maxGuests.goe(request.guests()));
		}

		// 가격만 추출
		List<Integer> prices = queryFactory
			.select(a.pricePerNight)
			.from(a)
			.where(condition.and(noOverlap))
			.fetch();

		if (prices.isEmpty()) {
			return new PriceHistogramResponseDto(0, 0, Collections.nCopies(binCount, 0));
		}

		int min = Collections.min(prices);
		int max = Collections.max(prices);

		if (min == max) {
			List<Integer> histogram = new ArrayList<>(Collections.nCopies(binCount, 0));
			histogram.set(0, prices.size());
			return new PriceHistogramResponseDto(min, max, histogram);
		}

		double binWidth = (max - min) / (double)binCount;
		List<Integer> histogram = new ArrayList<>(Collections.nCopies(binCount, 0));

		for (Integer price : prices) {
			int binIndex = (int)((price - min) / binWidth);
			if (binIndex >= binCount)
				binIndex = binCount - 1;
			histogram.set(binIndex, histogram.get(binIndex) + 1);
		}

		return new PriceHistogramResponseDto(min, max, histogram);
	}

/*
	public AccommodationResponseDto.AccommodationListDto getAccommodations(int page, int size) {
		//JPA에서 제공하는 페이징처리를 위한 객체 코드
		PageRequest pageRequest = PageRequest.of(page-1, size);

		//Page<Accommodation> 가져오기
		Page<Accommodation> accommodationPage = accommodationRepository.findAll(pageRequest);

		List<Accommodation> accommodationList = accommodationPage.getContent();

		//최종 반환할 AccommodationInfo 리스트
		List<AccommodationResponseDto.AccommodationInfo> accommodationInfos = new ArrayList<>();

		for(Accommodation accommodation : accommodationList){
			List<AccommodationAmenity> amenityList = accommodationAmenityRepository.findByAccommodation_Id(accommodation.getId());

			//amenity dto 변환
			List<AccommodationResponseDto.AmenityInfo> amenityInfos = new ArrayList<>();
			for(AccommodationAmenity accommodationAmenity: amenityList){
				AccommodationResponseDto.AmenityInfo amenityInfo = AccommodationResponseDto.AmenityInfo.builder()
					.id(accommodationAmenity.getAmenity().getId())
					.name(accommodationAmenity.getAmenity().getName())
					.build();
				amenityInfos.add(amenityInfo);
			}

			//숙소 대표 이미지
			String imageUrl = storedFileRepository
				.findByTargetTypeAndTargetIdAndFileOrder(
					StoredFile.TargetType.ACCOMMODATION,
					accommodation.getId(),
					1
				).map(StoredFile::getFileUrl)
				.orElse(null);

			//숙소 정보
			AccommodationResponseDto.AccommodationInfo accommodationInfo = AccommodationResponseDto.AccommodationInfo.builder()
				.id(accommodation.getId())
				.name(accommodation.getName())
				.imageUrl(imageUrl)
				.pricePerNight(accommodation.getPricePerNight())
				.description(accommodation.getDescription())
				.maxGuests(accommodation.getMaxGuests())
				.bedCount(accommodation.getBedCount())
				.addressId(
					accommodation.getAddress().getCity()+" "+
						accommodation.getAddress().getDistrict()+" "+
						accommodation.getAddress().getStreetAddress()
				)
				.amenity(amenityInfos)
				.latitude(accommodation.getAddress().getLatitude())
				.longitude(accommodation.getAddress().getLongitude())
				.build();

			accommodationInfos.add(accommodationInfo);
		}
		return AccommodationResponseDto.AccommodationListDto.builder()
			.page(page)
			.size(size)
			.totalPages(accommodationPage.getTotalPages())
			.totalElements((int) accommodationPage.getTotalElements()) // 전체 숙소 수
			.accommodations(accommodationInfos)
			.build();
	}

 */

}