// src/api/accommodationApi.js
// ✅ 숙소 검색 (검색바 필터 기반)
// ✅ 숙소 검색 (검색바 필터 기반)
import axios from 'axios';

const useMock = process.env.REACT_APP_USE_MOCK === 'true';
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// ✅ 숙소 검색 (검색바 필터 기반)
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
                    ],
                },
                error: null
            }
        };
    }

    const response = await axios.get(`${BASE_URL}/api/accommodations`, {params});
    return response;
};

// ✅ 지도 범위 기반 숙소 검색
export const getAccommodationsByMap = async (params) => {
    if (useMock) {
        console.log("📦 [MOCK] getAccommodationsByMap 실행");
        return {
            data: {
                success: true,
                data: {
                    accommodations: [
                        {
                            id: 3,
                            name: "제주도 바닷가 숙소",
                            imageUrl: null,
                            pricePerNight: 130000,
                            description: "한적한 바닷가 앞 숙소",
                            rating: 4.7,
                            reviewCount: 18,
                        },
                    ]
                },
                error: null
            }
        };
    }

    const response = await axios.get(`${BASE_URL}/api/accommodations/map`, {
        params,
    });
    return {data: response.data.data}; // 이 부분은 실제 API 구조에 맞게 유지
};
