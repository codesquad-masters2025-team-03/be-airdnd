// src/api/accommodationApi.js
import axios from 'axios';

// ✅ 실제 서버에서 숙소 데이터 가져오기 (검색바 필터 기반)
export const getAccommodations = async (params) => {
    const response = await axios.get('http://localhost:8080/api/accommodations', {
        params,
    });
    return response.data; // ✅ success, data, error 포함
};

// ✅ 지도 범위(위/경도)로 숙소 가져오기
export const getAccommodationsByMap = async (params) => {
    const response = await axios.get('http://localhost:8080/api/accommodations/map', {
        params,
    });
    return response.data;
};
