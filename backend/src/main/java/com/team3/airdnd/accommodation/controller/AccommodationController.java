package com.team3.airdnd.accommodation.controller;

import com.team3.airdnd.accommodation.service.AccomodationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/accommodations")
public class AccommodationController {
    private final AccomodationService accomodationService;
}
