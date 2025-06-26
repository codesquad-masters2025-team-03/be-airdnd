// src/api/accommodationApi.js
// ✅ 숙소 검색 (검색바 필터 기반)
// ✅ 숙소 검색 (검색바 필터 기반)
import axios from 'axios';
// ✅ 지도 범위 기반 숙소 검색
// accommodationApi.js
const useMock = process.env.REACT_APP_USE_MOCK === 'true';
const BASE_URL = 'http://localhost:8080'; // 8080 포트로 직접 요청

console.log('🔧 API 설정 확인:');
console.log('🔧 REACT_APP_USE_MOCK:', process.env.REACT_APP_USE_MOCK);
console.log('🔧 useMock:', useMock);
console.log('🔧 BASE_URL:', BASE_URL);

// 인증이 필요 없는 API용 axios 인스턴스
const publicAxios = axios.create({
    baseURL: BASE_URL
});

// 디버깅용 요청 인터셉터
publicAxios.interceptors.request.use((config) => {
    console.log('🔍 Public API 요청:', config.method?.toUpperCase(), config.url);
    console.log('🔍 요청 헤더:', config.headers);
    console.log('🔍 요청 파라미터:', config.params);
    return config;
});

// 인증이 필요한 API용 axios 인스턴스
const authAxios = axios.create({
    baseURL: BASE_URL
});

// 인증 헤더 추가 인터셉터
authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 JWT 토큰:', token);
        console.log('🔐 토큰 길이:', token.length);
        console.log('🔐 토큰 시작:', token.substring(0, 20) + '...');
    } else {
        console.log('⚠️ JWT 토큰이 없습니다!');
    }
    console.log('🔐 Auth API 요청:', config.method?.toUpperCase(), config.url);
    console.log('🔐 요청 헤더:', config.headers);
    return config;
});

export const getAccommodations = async (params) => {
    console.log('🚀 getAccommodations 호출됨');
    console.log('🚀 useMock 값:', useMock);
    console.log('🚀 파라미터:', params);
    
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

    console.log("🌐 실제 API 호출:", `${BASE_URL}/api/accommodations`);
    const response = await authAxios.get(`/api/accommodations`, {
        params,
    });
    return response;
};

export const getAccommodationDetail = async (id) => {
    console.log('🚀 getAccommodationDetail 호출됨');
    console.log('🚀 accommodationId:', id);
    console.log('🚀 useMock 값:', useMock);
    
    if (useMock) {
        console.log("📦 [MOCK] getAccommodationDetail 실행");
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
    
    console.log("🌐 실제 API 호출:", `${BASE_URL}/api/accommodations/${id}`);
    const response = await authAxios.get(`/api/accommodations/${id}`);
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
    const response = await authAxios.get(`/api/reservations/${accommodationId}`, {
        params: { checkIn, checkOut }
    });
    return response;
};

export const createReservation = async (accommodationId, guestId, checkIn, checkOut, guests) => {
    if (useMock) {
        // 필요시 mock 데이터 반환
        return {
            data: {
                reservationId: 123,
                success: true
            }
        };
    }
    const response = await authAxios.post(
        `/api/reservations/${accommodationId}?guestId=${guestId}`,
        { checkIn, checkOut, guests }
    );
    return response;
};

export const login = async (loginId, password) => {
    if (useMock) {
        return {
            data: {
                success: true,
                data: {
                    accessToken: "mock-jwt-token",
                    user: {
                        id: 1,
                        loginId: loginId,
                        username: "테스트 사용자"
                    }
                }
            }
        };
    }
    const response = await publicAxios.post(`/api/auth/login`, {
        loginId,
        password
    });
    
    // 🔍 로그인 응답 디버깅
    console.log('🔐 로그인 응답:', response.data);
    if (response.data?.data?.accessToken) {
        console.log('🔐 저장할 토큰:', response.data.data.accessToken);
        localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    
    return response;
};

export const signup = async (email, loginId, password, username, phone, profileImage) => {
    if (useMock) {
        return {
            data: {
                success: true,
                data: {
                    token: "mock-jwt-token",
                    user: {
                        id: 1,
                        loginId: loginId,
                        username: username
                    }
                }
            }
        };
    }
    const response = await publicAxios.post(`/api/auth/signup`, {
        email,
        loginId,
        password,
        username,
        phone,
        profileImage
    });
    return response;
};


