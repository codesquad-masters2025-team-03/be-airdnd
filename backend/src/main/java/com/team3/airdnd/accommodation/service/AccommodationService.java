package com.team3.airdnd.accommodation.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.team3.airdnd.accommodation.domain.Accommodation;
import com.team3.airdnd.accommodation.domain.AccommodationAmenity;
import com.team3.airdnd.accommodation.domain.Address;
import com.team3.airdnd.accommodation.domain.Amenity;
import com.team3.airdnd.accommodation.domain.AmenityType;
import com.team3.airdnd.accommodation.dto.AccommodationRequestDto;
import com.team3.airdnd.accommodation.domain.QAccommodation;
import com.team3.airdnd.accommodation.domain.QReservation;
import com.team3.airdnd.accommodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accommodation.dto.AmenityInfoDto;
import com.team3.airdnd.accommodation.dto.PriceHistogramRequestDto;
import com.team3.airdnd.accommodation.dto.PriceHistogramResponseDto;
import com.team3.airdnd.accommodation.dto.ReviewInfoDto;
import com.team3.airdnd.accommodation.repository.AccommodationAmenityRepository;
import com.team3.airdnd.accommodation.repository.AccommodationRepository;
import com.team3.airdnd.accommodation.repository.AddressRepository;
import com.team3.airdnd.accommodation.repository.AmenityRepository;
import com.team3.airdnd.accommodation.repository.ReservationRepository;
import com.team3.airdnd.accommodation.repository.ReviewRepository;
import com.team3.airdnd.global.exception.CommonException;
import com.team3.airdnd.global.exception.ErrorCode;
import com.team3.airdnd.storedFile.domain.StoredFile;
import com.team3.airdnd.storedFile.dto.ImageUrlDto;
import com.team3.airdnd.storedFile.repository.StoredFileRepository;
import com.team3.airdnd.user.domain.User;
import com.team3.airdnd.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AccommodationService {

	private final AccommodationRepository accommodationRepository;
	private final StoredFileRepository storedFileRepository;
	private final AccommodationAmenityRepository accommodationAmenityRepository;
	private final ReviewRepository reviewRepository;
	private final AddressRepository addressRepository;
	private final UserRepository userRepository;
	private final AmenityRepository amenityRepository;
	private final ReservationRepository reservationRepository;;
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

	@Transactional
	public void createAccommodation(AccommodationRequestDto.CreateAccommodationDto request) {
		User host = validateHostUser(request.getHostId());
		Address address = saveAdderss(request);
		Accommodation accommodation = saveAccommodation(request, address, host);
		saveAmenities(request.getAmenityTypes(), accommodation);
	}

	private Address saveAdderss(AccommodationRequestDto.CreateAccommodationDto request) {
		Address address = Address.builder()
			.city(request.getCity())
			.district(request.getDistrict())
			.streetAddress(request.getStreetAddress())
			.detailAddress(request.getDetailAddress())
			.latitude(request.getLatitude())
			.longitude(request.getLongitude())
			.build();
		return addressRepository.save(address);
	}

	private Accommodation saveAccommodation(AccommodationRequestDto.CreateAccommodationDto request, Address address,
		User host) {
		Accommodation accommodation = Accommodation.builder()
			.name(request.getName())
			.pricePerNight(request.getPricePerNight())
			.description(request.getDescription())
			.maxGuests(request.getMaxGuests())
			.bedCount(request.getBedCount())
			.bedroomCount(request.getBedroomCount())
			.bathroomCount(request.getBathroomCount())
			.address(address)
			.host(host)
			.build();

		return accommodationRepository.save(accommodation);
	}

	private void saveAmenities(List<AmenityType> amenityTypes, Accommodation accommodation) {
		List<Amenity> amenities = amenityRepository.findByNameIn(amenityTypes);
		for (Amenity amenity : amenities) {
			AccommodationAmenity mapping = AccommodationAmenity.builder()
				.accommodation(accommodation)
				.amenity(amenity)
				.build();

			accommodationAmenityRepository.save(mapping);
		}
	}

	@Transactional
	public void updateAccommodation(Long accommodationId, AccommodationRequestDto.UpdateAccommodationDto request,
		Long hostId) {
		Accommodation old = getAccommodation(accommodationId);
		User host = validateHostUser(hostId);
		validateOwnership(old, host); //본인 소유 숙소인지 확인

		Address updatedAddress = updateAddress(old.getAddress(), request);
		Accommodation updated = updateAccommodationFields(old, updatedAddress, request);

		updateAmenities(updated, request.getAmenityTypes());
	}

	private Accommodation getAccommodation(Long accommodationId) {
		return accommodationRepository.findById(accommodationId)
			.orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_RESOURCE));
	}

	private Address updateAddress(Address oldAddress, AccommodationRequestDto.UpdateAccommodationDto dto) {
		Address updated = oldAddress.toBuilder()
			.city(dto.getCity() != null ? dto.getCity() : oldAddress.getCity())
			.district(dto.getDistrict() != null ? dto.getDistrict() : oldAddress.getDistrict())
			.streetAddress(dto.getStreetAddress() != null ? dto.getStreetAddress() : oldAddress.getStreetAddress())
			.detailAddress(dto.getDetailAddress() != null ? dto.getDetailAddress() : oldAddress.getDetailAddress())
			.latitude(dto.getLatitude() != null ? dto.getLatitude() : oldAddress.getLatitude())
			.longitude(dto.getLongitude() != null ? dto.getLongitude() : oldAddress.getLongitude())
			.build();

		return addressRepository.save(updated);
	}

	private Accommodation updateAccommodationFields(Accommodation old, Address address,
		AccommodationRequestDto.UpdateAccommodationDto dto) {
		Accommodation updated = old.toBuilder()
			.name(dto.getName() != null ? dto.getName() : old.getName())
			.pricePerNight(dto.getPricePerNight() != null ? dto.getPricePerNight() : old.getPricePerNight())
			.description(dto.getDescription() != null ? dto.getDescription() : old.getDescription())
			.maxGuests(dto.getMaxGuests() != null ? dto.getMaxGuests() : old.getMaxGuests())
			.bedCount(dto.getBedCount() != null ? dto.getBedCount() : old.getBedCount())
			.bedroomCount(dto.getBedroomCount() != null ? dto.getBedroomCount() : old.getBedroomCount())
			.bathroomCount(dto.getBathroomCount() != null ? dto.getBathroomCount() : old.getBathroomCount())
			.address(address)
			.host(old.getHost()) // host는 수정 불가
			.build();

		return accommodationRepository.save(updated);
	}

	private void updateAmenities(Accommodation accommodation, List<AmenityType> types) {
		if (types == null)
			return;

		accommodationAmenityRepository.deleteByAccommodationId(accommodation.getId());

		List<Amenity> amenities = amenityRepository.findByNameIn(types);

		for (Amenity amenity : amenities) {
			AccommodationAmenity mapping = AccommodationAmenity.builder()
				.accommodation(accommodation)
				.amenity(amenity)
				.build();
			accommodationAmenityRepository.save(mapping);
		}
	}

	public void deleteAccommodation(Long accommodationId, Long hostId) {
		Accommodation accommodation = getAccommodation(accommodationId);
		User host = validateHostUser(hostId);
		validateOwnership(accommodation, host); //본인 소유 숙소인지 확인

		//예약 존재하는지 확인
		boolean hasReservation = reservationRepository.existsByAccommodationId(accommodationId);
		if (hasReservation) {
			throw new CommonException(ErrorCode.ACCOMMODATION_HAS_RESERVATIONS);
		}

		accommodationAmenityRepository.deleteByAccommodationId(accommodationId);
		addressRepository.delete(accommodation.getAddress());
		accommodationRepository.delete(accommodation);
	}

	//User 확인 + Host 권한 확인
	private User validateHostUser(Long hostId) {
		User user = userRepository.findById(hostId)
			.orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_USER));

		if (user.getRole() != User.Role.HOST) {
			throw new CommonException(ErrorCode.ACCESS_DENIED);
		}
		return user;
	}

	//본인 소유 숙소인지 확인
	private void validateOwnership(Accommodation accommodation, User host) {
		if (!accommodation.getHost().getId().equals(host.getId())) {
			throw new CommonException(ErrorCode.NOT_AUTHORIZED_TO_DELETE);
		}
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

	//숙소 목록 페이징 구현
	public AccommodationResponseDto.AccommodationListDto getAccommodations(int page, int size) {
		return accommodationRepository.getAccommodationListByPage(page, size);
	}
}
