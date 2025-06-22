import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components';
import KakaoMap from '../components/KakaoMap';
import AccommodationCard from '../components/AccommodationCard';
import {getAccommodations, getAccommodationsByMap} from '../api/accommodationApi';

const PageContainer = styled.div`
    display: flex;
    height: 100vh;
`;

const ListContainer = styled.div`
    width: 50%;
    padding: 20px;
    overflow-y: auto;
    border-right: 1px solid #ddd;
`;

const LoadingText = styled.p`
    font-size: 18px;
    text-align: center;
    margin-top: 40px;
`;

const MapContainer = styled.div`
    width: 50%;
    height: 100%;
`;

const AccommodationListPage = () => {
    const location = useLocation();
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemRefs = useRef({});

    useEffect(() => {
        itemRefs.current = (accommodations || []).reduce((acc, value) => {
            acc[value.id] = React.createRef();
            return acc;
        }, {});
    }, [accommodations]);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);

            try {
                const initial = location?.state?.initialData?.accommodations;
                if (initial && Array.isArray(initial)) {
                    setAccommodations(initial);
                    return;
                }

                const params = new URLSearchParams(location.search);
                const response = await getAccommodations(Object.fromEntries(params));

                const accommodationList = response?.data?.accommodations;
                if (response?.success && Array.isArray(accommodationList)) {
                    setAccommodations(accommodationList);
                } else {
                    throw new Error('숙소 데이터를 불러올 수 없습니다.');
                }
            } catch (e) {
                console.error('숙소 초기 데이터 불러오기 실패:', e);
                setError(e);
                setAccommodations([]); // fallback 제거하고 빈 배열
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [location.search, location?.state?.initialData]);

    const handleBoundsChange = useCallback(async (bounds) => {
        try {
            setLoading(true);
            setError(null);
            const currentParams = new URLSearchParams(location.search);
            const params = {
                ...Object.fromEntries(currentParams),
                northEastLat: bounds.ne.lat,
                northEastLng: bounds.ne.lng,
                southWestLat: bounds.sw.lat,
                southWestLng: bounds.sw.lng,
            };

            const response = await getAccommodationsByMap(params);
            const accommodationList = response?.data?.accommodations;
            if (response?.success && Array.isArray(accommodationList)) {
                setAccommodations(accommodationList);
            } else {
                throw new Error('지도 기반 숙소 데이터를 불러올 수 없습니다.');
            }
        } catch (e) {
            console.error('지도 기반 숙소 불러오기 실패:', e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [location.search]);

    const handleMarkerClick = (accommodationId) => {
        itemRefs.current[accommodationId]?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    };

    return (
        <PageContainer>
            <ListContainer>
                <h2>지도에서 선택한 지역의 숙소</h2>
                {loading ? (
                    <LoadingText>숙소를 불러오는 중...</LoadingText>
                ) : error ? (
                    <LoadingText>⚠️ 오류: {error.message}</LoadingText>
                ) : accommodations.length > 0 ? (
                    accommodations.map(acc => (
                        <div key={acc.id} ref={itemRefs.current[acc.id]}>
                            <AccommodationCard accommodation={acc}/>
                        </div>
                    ))
                ) : (
                    <LoadingText>해당 지역에 숙소가 없습니다.</LoadingText>
                )}
            </ListContainer>

            <MapContainer>
                <KakaoMap
                    accommodations={accommodations}
                    onBoundsChanged={handleBoundsChange}
                    onMarkerClick={handleMarkerClick}
                />
            </MapContainer>
        </PageContainer>
    );
};

export default AccommodationListPage;
