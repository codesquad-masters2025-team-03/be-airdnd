import React, {useCallback, useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components';
import KakaoMap from '../components/KakaoMap';
import AccommodationCard from '../components/AccommodationCard';
import {getAccommodations, getAccommodationsByMap} from '../api/accommodationApi';
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
    const [queryParams, setQueryParams] = useState(null);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    // const [selectedAccommodation, setSelectedAccommodation] = useState(null); // Not used yet
    const [isModalOpen, setIsModalOpen] = useState(false);

    // const itemRefs = useRef({}); // Not used yet

    useEffect(() => {
        const processData = (data, params) => {
            const accommodationList = data?.data?.accommodations;
            if (data?.success && Array.isArray(accommodationList)) {
                setAccommodations(accommodationList);
                setQueryParams(params);
            } else {
                console.error("데이터 처리 실패. 수신된 데이터:", data);
                throw new Error('숙소 데이터를 불러올 수 없습니다.');
            }
        };

        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (location.state?.initialData) {
                    processData(location.state.initialData.data, location.state.queryParams);
                } else {
                    const params = new URLSearchParams(location.search);
                    const paramsObject = Object.fromEntries(params);
                    const response = await getAccommodations(paramsObject);
                    processData(response.data, paramsObject);
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
        try {
            const response = await getAccommodationsByMap(bounds);
            const accommodationList = response?.data?.data?.accommodations;
            if (response?.data?.success && Array.isArray(accommodationList)) {
                setAccommodations(accommodationList);
            }
        } catch (error) {
            console.error("지도 기반 숙소 검색 실패:", error);
        }
    }, []);

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
                                    queryParams={queryParams}
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
