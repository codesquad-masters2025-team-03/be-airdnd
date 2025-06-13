package com.team3.airdnd.accommodation.service;

import com.team3.airdnd.accommodation.domain.Accommodation;
import com.team3.airdnd.accommodation.domain.Address;
import com.team3.airdnd.accommodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accommodation.dto.AmenityInfoDto;
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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;


import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.team3.airdnd.accommodation.domain.Accommodation;
import com.team3.airdnd.accommodation.domain.AccommodationAmenity;
import com.team3.airdnd.accommodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accommodation.repository.AccommodationRepository;
import com.team3.airdnd.accommodation.repository.AccommodationAmenityRepository;
import com.team3.airdnd.storedFile.domain.StoredFile;
import com.team3.airdnd.storedFile.repository.StoredFileRepository;

@Service
@RequiredArgsConstructor
public class AccommodationService {

    private final AccommodationRepository accommodationRepository;
    private final StoredFileRepository storedFileRepository;
    private final AccommodationAmenityRepository accommodationAmenityRepository;
    private final ReviewRepository reviewRepository;

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

}




