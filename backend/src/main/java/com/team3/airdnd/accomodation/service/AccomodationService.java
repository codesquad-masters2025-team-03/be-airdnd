package com.team3.airdnd.accomodation.service;

import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.team3.airdnd.accomodation.domain.Accommodation;
import com.team3.airdnd.accomodation.domain.AccommodationAmenity;
import com.team3.airdnd.accomodation.domain.Amenity;
import com.team3.airdnd.accomodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accomodation.repository.AccommodationRepository;
import com.team3.airdnd.accomodation.repository.AccommodationAmenityRepository;
import com.team3.airdnd.storedFile.domain.StoredFile;
import com.team3.airdnd.storedFile.repository.StoredFileRepository;

@Service
@RequiredArgsConstructor
public class AccomodationService {

	private final AccommodationRepository accommodationRepository;
	private final AccommodationAmenityRepository accommodationAmenityRepository;
	private final StoredFileRepository storedFileRepository;

	/*
	* page = 페이지 번호(1부터 시작)
	* size = 한 페이지당 숙소 수
	*
	*/

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
