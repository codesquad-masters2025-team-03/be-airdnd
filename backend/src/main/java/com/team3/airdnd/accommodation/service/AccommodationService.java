package com.team3.airdnd.accommodation.service;

import com.team3.airdnd.accommodation.domain.Accommodation;
import com.team3.airdnd.accommodation.domain.Address;
import com.team3.airdnd.accommodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accommodation.dto.AmenityResponseDto;
import com.team3.airdnd.accommodation.dto.ReviewResponseDto;
import com.team3.airdnd.accommodation.repository.AccommodationAmenityRepository;
import com.team3.airdnd.accommodation.repository.AccommodationRepository;
import com.team3.airdnd.accommodation.repository.ReviewRepository;
import com.team3.airdnd.global.exception.CommonException;
import com.team3.airdnd.global.exception.ErrorCode;
import com.team3.airdnd.storedFile.domain.StoredFile;
import com.team3.airdnd.storedFile.dto.StoredFileResponseDto;
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
        List<StoredFileResponseDto.ImageUrlDto> imageUrls = findAllImageUrlsByAccommodationId(id);
        List<AmenityResponseDto.AmenityInfoDto> amenities = findAmenityNamesByAccommodationId(id);
        ReviewResponseDto.ReviewListDto reviewLists = buildReviewLists(id);
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

    private List<StoredFileResponseDto.ImageUrlDto> findAllImageUrlsByAccommodationId(Long id) {
        return storedFileRepository.findImageByTargetTypeAndTargetIdOrderByFileOrderAsc(
                        StoredFile.TargetType.ACCOMMODATION, id);
    }
    private List<AmenityResponseDto.AmenityInfoDto> findAmenityNamesByAccommodationId(Long id) {
        return accommodationAmenityRepository.findAmenityByAccommodationId(id);
    }

    private ReviewResponseDto.ReviewListDto buildReviewLists(Long id) {
        List<ReviewResponseDto.ReviewInfoDto> reviews = reviewRepository.findReviewByAccommodationId(id);

        double avg = reviews.stream()
                .mapToDouble(ReviewResponseDto.ReviewInfoDto::getRating)
                .average()
                .orElse(0.0);

        return ReviewResponseDto.ReviewListDto.builder()
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
