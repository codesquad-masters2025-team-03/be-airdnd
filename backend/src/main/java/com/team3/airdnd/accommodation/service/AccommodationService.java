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

}
