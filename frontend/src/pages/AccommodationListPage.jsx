import React, {useCallback, useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components';
import KakaoMap from '../components/KakaoMap';
import AccommodationCard from '../components/AccommodationCard';
import {getAccommodations} from '../api/accommodationApi';
import SearchBar from "../components/SearchBar";
import {FaSearch} from "react-icons/fa";

const PageContainer = styled.div`
    display: flex;
    height: calc(100vh - 80px); /* Adjust based on header height */
    position: relative;
`;

const ListContainer = styled.div`
    width: 50%;
    max-width: 840px;
    padding: 20px;
    overflow-y: auto;
`;

const MapContainer = styled.div`
    width: 50%;
    height: 100%;
`;

const LoadingText = styled.p`
    font-size: 18px;
    text-align: center;
    margin-top: 40px;
`;

const Header = styled.header`
    padding: 16px;
    border-bottom: 1px solid #ddd;
`;

const MiniSearchBar = styled.div`
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 40px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;

    span {
        margin-right: 8px;
    }
`;

const FullScreenSearchContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: white;
    z-index: 20;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const AccommodationListPage = () => {
    const location = useLocation();
    // const navigate = useNavigate(); // Not used yet

    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 기본값으로 queryParams 초기화
    const [queryParams, setQueryParams] = useState({
        page: 1,
        size: 10,
        checkIn: null,
        checkOut: null,
        guests: 1,
        minPrice: 1000,
        maxPrice: 10000000,
    });

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    // const [selectedAccommodation, setSelectedAccommodation] = useState(null); // Not used yet
    const [isModalOpen, setIsModalOpen] = useState(false);

    // const itemRefs = useRef({}); // Not used yet

    useEffect(() => {
        const processData = (data, params) => {
            console.log("📊 processData 진입:", data);
            console.log("📋 processData params:", params);
            
            const accommodationList = data?.data?.accommodations;
            if (data?.success && Array.isArray(accommodationList)) {
                console.log("✅ 유효한 숙소 데이터 수신:", accommodationList.length);
                setAccommodations(accommodationList);
                
                // queryParams를 명시적으로 설정 (기본값 유지)
                const processedParams = {
                    page: params.page || 1,
                    size: params.size || 10,
                    checkIn: params.checkIn,
                    checkOut: params.checkOut,
                    guests: params.guests || 1,
                    minPrice: params.minPrice || 1000,
                    maxPrice: params.maxPrice || 10000000,
                };
                
                console.log("🔧 설정된 queryParams:", processedParams);
                setQueryParams(processedParams);
            } else {
                console.error("❌ 숙소 데이터 처리 실패: ", data);
                throw new Error('숙소 데이터를 불러올 수 없습니다.');
            }
        };

        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (location.state?.initialData) {
                    console.log("📍 location.state에서 데이터 로드");
                    processData(location.state.initialData, location.state.queryParams);
                } else {
                    console.log("📍 URL 파라미터에서 데이터 로드");
                    const params = new URLSearchParams(location.search);
                    const paramsObject = Object.fromEntries(params);
                    console.log("📍 URL 파라미터:", paramsObject);
                    
                    // URL 파라미터가 있으면 사용, 없으면 기본값으로 검색
                    if (Object.keys(paramsObject).length > 0) {
                        const response = await getAccommodations(paramsObject);
                        processData(response.data, paramsObject);
                    } else {
                        // 기본값으로 검색
                        const defaultParams = {
                            page: 1,
                            size: 10,
                            checkIn: new Date().toISOString().split('T')[0], // 오늘
                            checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 내일
                            guests: 1,
                            minPrice: 1000,
                            maxPrice: 10000000,
                        };
                        const response = await getAccommodations(defaultParams);
                        processData(response.data, defaultParams);
                    }
                }
            } catch (e) {
                console.error('❌ 숙소 초기 데이터 불러오기 실패:', e);
                setError(e);
                setAccommodations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [location.search, location.state]);

    const handleBoundsChanged = useCallback(async (bounds) => {
        console.log("🗺️ Map bounds changed:", bounds);
        console.log("📋 Current queryParams:", queryParams);

        try {
            const mapSearchParams = {
                // 기존 필터 파라미터들 (기본값 포함)
                page: queryParams.page || 1,
                size: queryParams.size || 10,
                checkIn: queryParams.checkIn || new Date().toISOString().split('T')[0],
                checkOut: queryParams.checkOut || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                guests: queryParams.guests || 1,
                minPrice: queryParams.minPrice || 1000,
                maxPrice: queryParams.maxPrice || 10000000,
                
                // 지도 경계 파라미터들
                southWestLat: bounds.sw.lat,
                southWestLng: bounds.sw.lng,
                northEastLat: bounds.ne.lat,
                northEastLng: bounds.ne.lng,
            };

            console.log("🚀 지도 기반 검색 요청 파라미터:", mapSearchParams);

            const response = await getAccommodations(mapSearchParams);

            console.log("📦 지도 기반 검색 응답:", response);

            const accommodationList = response?.data?.data?.accommodations;
            if (response?.data?.success && Array.isArray(accommodationList)) {
                console.log("✅ 지도 기반 검색 성공:", accommodationList.length + "개 숙소");
                setAccommodations(accommodationList);
            } else {
                console.error("❌ 지도 기반 검색 실패:", response);
            }
        } catch (error) {
            console.error("지도 기반 숙소 검색 실패:", error);
        }
    }, [queryParams]);

    const handleCardClick = (accommodation) => {
        // setSelectedAccommodation(accommodation);
        setIsModalOpen(true);
        console.log("Card clicked:", accommodation);
    };

    const renderMiniSearchBar = () => (
        <Header>
            <MiniSearchBar onClick={() => setIsSearchOpen(true)}>
                <span>{queryParams?.checkIn ? `${queryParams.checkIn} ~ ${queryParams.checkOut}` : '언제 떠나세요?'}</span>
                <span>·</span>
                <span>게스트 {queryParams?.guests || 1}명</span>
                <FaSearch style={{marginLeft: 8, color: '#ff385c'}}/>
            </MiniSearchBar>
        </Header>
    );

    return (
        <>
            {renderMiniSearchBar()}
            {isSearchOpen && (
                <FullScreenSearchContainer>
                    <SearchBar onSearchComplete={() => setIsSearchOpen(false)}/>
                    <button onClick={() => setIsSearchOpen(false)}>닫기</button>
                </FullScreenSearchContainer>
            )}
            <PageContainer>
                <ListContainer>
                    {loading ? (
                        <LoadingText>숙소를 불러오는 중...</LoadingText>
                    ) : error ? (
                        <LoadingText>⚠️ 오류: {error.message}</LoadingText>
                    ) : accommodations.length > 0 ? (
                        <>
                            <p>{accommodations.length}개의 숙소</p>
                            {accommodations.map(acc => (
                                <AccommodationCard
                                    key={acc.id}
                                    accommodation={acc}
                                    queryParams={queryParams} MiniSearchBar
                                    onClick={() => handleCardClick(acc)}
                                />
                            ))}
                        </>
                    ) : (
                        <LoadingText>해당 지역에 숙소가 없습니다.</LoadingText>
                    )}
                </ListContainer>

                <MapContainer>
                    <KakaoMap
                        accommodations={accommodations}
                        onBoundsChanged={handleBoundsChanged}
                        onMarkerClick={(id) => console.log('Marker clicked', id)}
                    />
                </MapContainer>
            </PageContainer>

            {isModalOpen && (
                <div>예약모달</div> /* Placeholder for ReservationModal */
            )}
        </>
    );
};

export default AccommodationListPage;
