// src/api/accommodationApi.js
// ✅ 숙소 검색 (검색바 필터 기반)
// ✅ 숙소 검색 (검색바 필터 기반)
import axios from 'axios';
// ✅ 지도 범위 기반 숙소 검색
// accommodationApi.js
const useMock = process.env.REACT_APP_USE_MOCK === 'true';
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const getAccommodations = async (params) => {
    if (useMock) {
        console.log("📦 [MOCK] getAccommodations 실행");
        return {
            data: {
                success: true,
                data: {
                    accommodations: [
                        {
                            id: 1,
                            name: "서울 강남 숙소",
                            imageUrl: null,
                            pricePerNight: 90000,
                            description: "강남역 근처 숙소",
                            rating: 4.5,
                            reviewCount: 22,
                        },
                        {
                            id: 2,
                            name: "부산 해운대 숙소",
                            imageUrl: null,
                            pricePerNight: 110000,
                            description: "바다 뷰 숙소",
                            rating: 4.9,
                            reviewCount: 45,
                        },
                        {
                            id: 3,
                            name: "제주도 바닷가 숙소",
                            imageUrl: null,
                            pricePerNight: 130000,
                            description: "한적한 바닷가 앞 숙소",
                            rating: 4.7,
                            reviewCount: 18,
                        },
                    ],
                },
                error: null,
            },
        };
    }

    const response = await axios.get(`${BASE_URL}/api/accommodations`, {
        params,
    });
    return response;
};

export const getAccommodationDetail = async (id) => {
    if (useMock) {
        // 필요시 mock 데이터 반환
        return {
            data: {
                success: true,
                data: {
                    name: "Mock 숙소",
                    imageUrls: [],
                    amenities: [],
                    hostId: 1,
                    description: "Mock 숙소 설명",
                    pricePerNight: 10000,
                    maxGuests: 2,
                    bedCount: 1,
                    address: {
                        city: "서울",
                        district: "강남구",
                        streetAddress: "테헤란로 123",
                        latitude: 37.5,
                        longitude: 127.0
                    },
                    reviews: {
                        avgRating: 5.0,
                        reviewSize: 1,
                        comments: [
                            {
                                commentId: 1,
                                content: "아주 좋아요!",
                                createdAt: "2025-06-11T10:23:00",
                                guestId: 2,
                                guestName: "홍길동",
                                profileUrl: "",
                                rating: 5.0
                            }
                        ]
                    }
                },
                error: null
            }
        };
    }
    const response = await axios.get(`${BASE_URL}/api/accommodations/${id}`);
    return response;
};

export const getReservationInfo = async (accommodationId, checkIn, checkOut) => {
    if (useMock) {
        return {
            data: {
                available: true,
                nights: 2,
                pricePerNight: 250000,
                totalPrice: 500000,
                serviceFee: 50000,
                finalPrice: 550000
            }
        };
    }
    const response = await axios.get(`${BASE_URL}/api/reservations/${accommodationId}`, {
        params: { checkIn, checkOut }
    });
    return response;
};


