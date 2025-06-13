package com.team3.airdnd.accomodation.controller;

import com.team3.airdnd.accomodation.dto.AccommodationResponseDto;
import com.team3.airdnd.accomodation.service.AccomodationService;
import com.team3.airdnd.global.dto.ResponseDto;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/accommodations")
public class AccommodationController {
    private final AccomodationService accomodationService;

    @GetMapping("")
    public ResponseDto<AccommodationResponseDto.AccommodationListDto> getAccommodationList(
        @RequestParam(required = false, defaultValue = "1") int page,
        @RequestParam(required = false, defaultValue = "5") int size
        ){
        AccommodationResponseDto.AccommodationListDto accommodations = accomodationService.getAccommodations(page, size);

        return ResponseDto.ok(accommodations);
    }
}
