import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import KakaoMap from '../components/KakaoMap';
import AccommodationCard from '../components/AccommodationCard';
import {getAccommodations} from '../api/accommodationApi';
import SearchBar from "../components/SearchBar";
import {FaSearch} from "react-icons/fa";
import {isLoggedIn, getCurrentUser} from '../utils/auth';

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

const Navbar = styled.nav`
    width: 100vw;
    min-width: 320px;
    background: #fff;
    border-bottom: 1.5px solid #eee;
    display: flex;
    align-items: center;
    height: 64px;
    padding: 0 32px;
    box-sizing: border-box;
    position: sticky;
    top: 0;
    z-index: 100;
`;

const NavbarContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
`;

const NavbarFlex = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    position: relative;
`;

const NavbarLeft = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
`;

const NavbarCenter = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const NavbarRight = styled.div`
    flex: 1;
`;

const Logo = styled.div`
    font-size: 1.6rem;
    font-weight: bold;
    color: #FF385C;
    cursor: pointer;
    user-select: none;
    margin-right: 32px;
`;

const CenteredMiniSearchBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
`;

const MiniSearchBarBox = styled.div`
    display: inline-flex;
    align-items: center;
    padding: 10px 24px;
    border: 1.5px solid #ddd;
    border-radius: 40px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    background: #fff;
    cursor: pointer;
    font-size: 1.08rem;
    font-weight: 500;
    transition: box-shadow 0.2s;
    &:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.13);
    }
`;

const ExpandedSearchContainer = styled.div`
    position: absolute;
    left: 50%;
    top: 72px;
    transform: translateX(-50%);
    background: #fff;
    border-radius: 32px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    padding: 32px 32px 24px 32px;
    z-index: 2001;
    min-width: 600px;
    max-width: 95vw;
`;

const Overlay = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: transparent;
    z-index: 2000;
`;

const UserMenuContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const UserButton = styled.button`
    background: #f7f7f7;
    border: none;
    border-radius: 50px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    color: #444;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
`;

const UserIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #bbb;
    color: #fff;
    font-size: 18px;
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 48px;
    right: 0;
    min-width: 160px;
    background: #fff;
    border: 2px dashed #6c3;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.13);
    z-index: 100;
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 0;
`;

const DropdownItem = styled.div`
    padding: 10px 24px;
    cursor: pointer;
    font-size: 16px;
    color: #222;
    &:hover {
        background: #f7f7f7;
    }
`;

const ListCount = styled.p`
    font-size: 1.1rem;
    font-weight: 500;
    color: #222;
    margin: 0 0 16px 0;
    text-align: left;
`;

function parseJwt(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

const AccommodationListPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

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
    const [menuOpen, setMenuOpen] = useState(false);
    const isUserLoggedIn = isLoggedIn();
    const user = getCurrentUser();

    // const itemRefs = useRef({}); // Not used yet

    const token = localStorage.getItem('accessToken');

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

    // 외부 클릭 시 검색창 닫기
    useEffect(() => {
        if (!isSearchOpen) return;
        const handleClick = (e) => {
            if (!document.getElementById('expanded-search-container')?.contains(e.target) &&
                !document.getElementById('mini-search-bar')?.contains(e.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isSearchOpen]);

    // Airbnb 스타일 미니검색바 문구
    const getMiniSearchText = () => {
        if (queryParams?.checkIn && queryParams?.checkOut && queryParams?.guests) {
            return `${queryParams.checkIn} ~ ${queryParams.checkOut} · 게스트 ${queryParams.guests}명`;
        }
        return '어디든지 · 언제든 일주일 · 게스트 추가';
    };

    const renderMiniSearchBar = () => (
        <CenteredMiniSearchBar>
            <MiniSearchBarBox id="mini-search-bar" onClick={() => setIsSearchOpen(true)}>
                {getMiniSearchText()}
                <FaSearch style={{marginLeft: 12, color: '#ff385c'}}/>
            </MiniSearchBarBox>
        </CenteredMiniSearchBar>
    );

    const handleMenuClick = () => setMenuOpen((v) => !v);
    const handleMenuClose = () => setMenuOpen(false);

    const handleDropdownClick = (action) => {
        handleMenuClose();
        if (action === 'login') {
            navigate('/login');
        } else if (action === 'messages') {
            if (isUserLoggedIn) {
                navigate('/chatroom');
            } else {
                alert('로그인이 필요합니다.');
                navigate('/login');
            }
        } else if (action === 'trips') {
            if (user?.userId) navigate(`/api/reservations/guest/${user.userId}/confirmed`);
        } else if (action === 'profile') {
            navigate('/profile');
        }
    };

    return (
        <>
            <Navbar>
                <NavbarContent>
                    <NavbarFlex>
                        <NavbarLeft>
                            <Logo onClick={() => navigate('/')}>AirDND</Logo>
                        </NavbarLeft>
                        <NavbarCenter>
                            {renderMiniSearchBar()}
                        </NavbarCenter>
                        <NavbarRight style={{justifyContent:'flex-end', display:'flex'}}>
                            <UserMenuContainer>
                                <UserButton onClick={handleMenuClick}>
                                    <span style={{fontSize:'20px'}}>☰</span>
                                    {isUserLoggedIn && user?.profileImage ? (
                                        <UserIcon>
                                            <img 
                                                src={user.profileImage} 
                                                alt="프로필" 
                                                style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </UserIcon>
                                    ) : (
                                        <UserIcon> <span role="img" aria-label="user">👤</span> </UserIcon>
                                    )}
                                </UserButton>
                                {menuOpen && (
                                    <DropdownMenu onMouseLeave={handleMenuClose}>
                                        {!isUserLoggedIn ? (
                                            <DropdownItem onClick={() => handleDropdownClick('login')}>로그인</DropdownItem>
                                        ) : (
                                            <>
                                                <DropdownItem onClick={() => handleDropdownClick('messages')}>메시지</DropdownItem>
                                                <DropdownItem onClick={() => handleDropdownClick('trips')}>내 여행</DropdownItem>
                                                <DropdownItem onClick={() => handleDropdownClick('profile')}>프로필</DropdownItem>
                                            </>
                                        )}
                                    </DropdownMenu>
                                )}
                            </UserMenuContainer>
                        </NavbarRight>
                    </NavbarFlex>
                </NavbarContent>
            </Navbar>
            {isSearchOpen && (
                <>
                    <Overlay />
                    <ExpandedSearchContainer id="expanded-search-container">
                        <SearchBar onSearchComplete={() => setIsSearchOpen(false)}/>
                    </ExpandedSearchContainer>
                </>
            )}
            <PageContainer>
                <ListContainer>
                    {loading ? (
                        <LoadingText>숙소를 불러오는 중...</LoadingText>
                    ) : error ? (
                        <LoadingText>⚠️ 오류: {error.message}</LoadingText>
                    ) : accommodations.length > 0 ? (
                        <>
                            <ListCount>
                                {accommodations.length >= 1000
                                    ? '1000개 이상의 숙소'
                                    : `${accommodations.length}개의 숙소`}
                            </ListCount>
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
