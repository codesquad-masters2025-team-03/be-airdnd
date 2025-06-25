import React, {useEffect, useState, useMemo, useRef} from 'react';
import styled from 'styled-components';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import KakaoMap from '../components/KakaoMap';
import {getAccommodationDetail, getReservationInfo} from '../api/accommodationApi';
import { format } from 'date-fns';

import {
    FaWifi,
    FaTv,
    FaSnowflake,
    FaSwimmer,
    FaParking,
    FaDumbbell,
    FaUtensils,
    FaTshirt,
    FaFireAlt
} from 'react-icons/fa';
import {
    MdKitchen,
    MdLocalLaundryService,
    MdAcUnit,
    MdOutlineLocalParking,
    MdOutlinePool,
    MdOutlineTv,
    MdOutlineWifi,
    MdOutlineFitnessCenter,
    MdOutlineKitchen,
    MdOutlineLocalLaundryService,
    MdOutlineFireplace,
    MdOutlineDry,
    MdOutlineBathroom,
    MdOutlineDirectionsCar
} from 'react-icons/md';
import CalendarDropdown from '../components/CalendarDropdown';

const PageWrapper = styled.div`
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 0 40px 0;
    @media (max-width: 900px) {
        padding: 0 0 40px 0;
    }
`;

const ImageGrid = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 220px 220px;
    gap: 8px;
    margin-bottom: 0;
    @media (max-width: 900px) {
        display: flex;
        overflow-x: auto;
        height: 220px;
        img {
            min-width: 220px;
            height: 100%;
        }
    }
`;
const MainImage = styled.img`
    grid-row: 1 / span 2;
    grid-column: 1 / 2;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px 0 0 16px;
`;
const SubImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0;

    &:first-child {
        border-radius: 0 16px 0 0;
    }

    &:nth-child(2) {
        border-radius: 0 0 16px 0;
    }
`;

const MainRow = styled.div`
    display: flex;
    gap: 40px;
    margin-top: 0;
    @media (max-width: 900px) {
        flex-direction: column;
        gap: 24px;
    }
`;
const LeftCol = styled.div`
    flex: 6;
    min-width: 0;
`;
const RightCol = styled.div`
    flex: 4;
    min-width: 320px;
    max-width: 400px;
    @media (max-width: 900px) {
        max-width: 100%;
        min-width: 0;
    }
`;
const Title = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    margin: 16px 0 4px 0;
`;
const Summary = styled.div`
    color: #555;
    font-size: 1.08rem;
    margin-bottom: 12px;
`;
const Separator = styled.hr`
    border: none;
    border-top: 1.5px solid #eee;
    margin: 24px 0 24px 0;
`;
const Description = styled.div`
    font-size: 1.1rem;
    margin-bottom: 24px;
`;
const Amenities = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    list-style: none;
    padding: 0;
    margin: 0 0 24px 0;

    li {
        background: #f7f7f7;
        border-radius: 20px;
        padding: 7px 16px;
        font-size: 0.97rem;
    }
`;
const HostInfo = styled.div`
    margin-bottom: 24px;
    font-size: 1.1rem;
`;
const ReviewSection = styled.section`
    margin-bottom: 32px;
`;
const ReviewHeader = styled.div`
    font-weight: bold;
    margin-bottom: 8px;
`;
const ReviewList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;
const ReviewCard = styled.div`
    background: #fafafa;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
`;
const ProfileImg = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
`;
const ReviewContent = styled.div`
    flex: 1;
`;

const ReserveBox = styled.aside`
    flex: 1;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 16px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
    padding: 28px 24px 24px 24px;
    height: fit-content;
    min-width: 320px;
    max-width: 380px;
    position: sticky;
    top: 32px;
    @media (max-width: 900px) {
        position: static;
        min-width: 0;
        max-width: 100%;
        width: 100%;
    }
`;
const Price = styled.div`
    font-size: 1.3rem;
    font-weight: 600;
    color: #ff385c;
    margin-bottom: 8px;
`;
const ReserveButton = styled.button`
    width: 100%;
    background: #ff385c;
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
    padding: 16px 0;
    border: none;
    border-radius: 10px;
    margin-top: 18px;
    cursor: pointer;
`;
const ReserveSummary = styled.div`
    margin: 18px 0 8px 0;
    color: #555;
    font-size: 0.98rem;
`;
const ReserveRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.08rem;
    margin: 6px 0;
`;
const ReserveTotal = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 1.15rem;
    margin-top: 18px;
`;

const MapSection = styled.section`
    margin: 48px 0 0 0;
`;
const MapBox = styled.div`
    height: 340px;
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 12px;
`;
const Address = styled.div`
    color: #555;
    margin-bottom: 8px;
`;

// 어메니티 타입별 아이콘 매핑
const AMENITY_ICONS = {
    WIFI: <MdOutlineWifi size={20}/>,
    TV: <MdOutlineTv size={20}/>,
    AIR_CONDITIONER: <MdAcUnit size={20}/>,
    HAIR_DRYER: <MdOutlineDry size={20}/>,
    POOL: <MdOutlinePool size={20}/>,
    PARKING: <MdOutlineDirectionsCar size={20}/>,
    GYM: <MdOutlineFitnessCenter size={20}/>,
    KITCHEN: <MdOutlineKitchen size={20}/>,
    LAUNDRY: <MdOutlineLocalLaundryService size={20}/>,
    HEATER: <MdOutlineFireplace size={20}/>,
};

const HostBox = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
`;
const HostProfile = styled.img`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    background: #eee;
`;
const HostInfoCol = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;
const HostName = styled.div`
    font-weight: bold;
    font-size: 1.1rem;
`;
const HostDesc = styled.div`
    color: #888;
    font-size: 0.97rem;
`;
const DescriptionBox = styled.div`
    margin-bottom: 18px;
    position: relative;
    text-align: left;
`;
const DescText = styled.div`
    font-size: 1.1rem;
    line-height: 1.5;
    max-height: ${({expanded}) => expanded ? 'none' : '3.2em'};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: ${({expanded}) => expanded ? 'unset' : 2};
    -webkit-box-orient: vertical;
`;
const MoreBtn = styled.button`
    background: #fff;
    border: 1.5px solid #bbb;
    border-radius: 12px;
    padding: 7px 22px;
    font-size: 1rem;
    margin-top: 8px;
    cursor: pointer;
`;
const AmenitiesList = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    list-style: none;
    padding: 0;
    margin: 0 0 24px 0;

    li {
        display: flex;
        align-items: center;
        gap: 7px;
        background: #f7f7f7;
        border-radius: 20px;
        padding: 7px 16px;
        font-size: 0.97rem;
    }
`;

const ReserveForm = styled.div`
    border: 1px solid #eee;
    border-radius: 16px;
    background: #fff;
    padding: 24px 20px 18px 20px;
    margin-bottom: 12px;
`;
const ReserveInputRow = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    justify-content: center;
`;
const ReserveInput = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px 12px;
    background: #f5f5f5;
    font-size: 1rem;
    min-width: 120px;
    max-width: 180px;
    align-items: center;
    label {
        font-size: 0.92rem;
        color: #888;
        margin-bottom: 2px;
        text-align: center;
    }
    select, input {
        border: none;
        background: #f5f5f5;
        font-size: 1rem;
        outline: none;
        width: 100%;
        text-align: center;
        cursor: not-allowed;
    }
`;
const CalendarInlineWrap = styled.div`
    display: flex;
    justify-content: center;
    margin: 0 0 12px 0;
`;
const ReservePriceRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.08rem;
    margin: 6px 0;
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
const Logo = styled.div`
    font-size: 1.6rem;
    font-weight: bold;
    color: #FF385C;
    cursor: pointer;
    user-select: none;
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

const AccommodationDetailPage = () => {
    const {id} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [descExpanded, setDescExpanded] = useState(false);
    const [reservationInfo, setReservationInfo] = useState(null);
    const [reserveLoading, setReserveLoading] = useState(false);
    const [reserveError, setReserveError] = useState(null);

    // 예약 form 상태
    const queryParams = location.state?.queryParams || {};
    const [checkIn] = useState(queryParams.checkIn || '');
    const [checkOut] = useState(queryParams.checkOut || '');
    const [guests] = useState(queryParams.guests || 1);

    const [menuOpen, setMenuOpen] = useState(false);
    const token = localStorage.getItem('jwt');
    const user = parseJwt(token);
    const isLoggedIn = !!user;
    const guestId = user?.id;

    const handleMenuClick = () => setMenuOpen((v) => !v);
    const handleMenuClose = () => setMenuOpen(false);

    const handleDropdownClick = (action) => {
        handleMenuClose();
        if (action === 'login') {
            navigate('/login');
        } else if (action === 'messages') {
            navigate('/chatroom');
        } else if (action === 'trips') {
            if (guestId) navigate(`/api/reservations/guest/${guestId}/confirmed`);
        } else if (action === 'profile') {
            navigate('/profile');
        }
    };

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const res = await getAccommodationDetail(id);
                setData(res.data.data);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    // 예약 정보 API 호출
    useEffect(() => {
        if (!checkIn || !checkOut) return;
        setReserveLoading(true);
        setReserveError(null);
        getReservationInfo(id, checkIn, checkOut)
            .then(res => setReservationInfo(res.data))
            .catch(e => setReserveError(e))
            .finally(() => setReserveLoading(false));
    }, [id, checkIn, checkOut]);

    // 설명 3줄 이상일 때만 더보기 노출
    const isLongDescription = useMemo(() => {
        if (!data?.description) return false;
        // 3줄 기준: 120자 이상이면 더보기 노출(대략적)
        return data.description.length > 120;
    }, [data]);

    if (loading) return <PageWrapper>로딩 중...</PageWrapper>;
    if (error) return <PageWrapper>오류가 발생했습니다.</PageWrapper>;
    if (!data) return null;

    const {
        name,
        imageUrls,
        amenities,
        hostName,
        hostProfileUrl,
        description,
        pricePerNight,
        maxGuests,
        bedCount,
        address,
        reviews
    } = data;
    const mainImg = imageUrls && imageUrls[0]?.imageUrl;
    const subImgs = imageUrls ? imageUrls.slice(1, 5) : [];
    const mapCenter = {lat: address.latitude, lng: address.longitude};
    const mapMarkers = [{latitude: address.latitude, longitude: address.longitude}];

    // 가격 계산 (수수료 10%)
    const nights = reservationInfo?.nights || 0;
    const nightly = reservationInfo?.pricePerNight || pricePerNight;
    const totalPrice = nights * nightly;
    const serviceFee = Math.round(totalPrice * 0.1);
    const finalPrice = totalPrice + serviceFee;

    return (
        <>
            <Navbar>
                <Logo onClick={() => navigate('/')}>AirDND</Logo>
                <div style={{flex:1}} />
                <UserMenuContainer>
                    <UserButton onClick={handleMenuClick}>
                        <span style={{fontSize:'20px'}}>☰</span>
                        <UserIcon> <span role="img" aria-label="user">👤</span> </UserIcon>
                    </UserButton>
                    {menuOpen && (
                        <DropdownMenu onMouseLeave={handleMenuClose}>
                            {!isLoggedIn ? (
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
            </Navbar>
            <PageWrapper>
                <Title>{name}</Title>
                <Summary>최대 인원 {maxGuests}명 · 침대 {bedCount}개</Summary>
                <ImageGrid>
                    {mainImg && <MainImage src={mainImg} alt={name}/>}
                    {subImgs.map((img, i) => (
                        <SubImage key={img.id} src={img.imageUrl} alt={name + i}
                                  style={i === 0 ? {gridColumn: 2, gridRow: 1} : i === 1 ? {
                                      gridColumn: 3,
                                      gridRow: 1
                                  } : i === 2 ? {gridColumn: 2, gridRow: 2} : {gridColumn: 3, gridRow: 2}}/>
                    ))}
                </ImageGrid>
                <MainRow>
                    <LeftCol>
                        <HostBox>
                            <HostProfile src={hostProfileUrl || 'https://via.placeholder.com/56'} alt={hostName}/>
                            <HostName>호스트: {hostName || '알 수 없음'}</HostName>
                        </HostBox>
                        <AmenitiesList>
                            {amenities && amenities.map(a => (
                                <li key={a.id}>{AMENITY_ICONS[a.name] || null}{a.name}</li>
                            ))}
                        </AmenitiesList>
                        <DescriptionBox>
                            <DescText expanded={descExpanded}>{description}</DescText>
                            {!descExpanded && isLongDescription && (
                                <MoreBtn onClick={() => setDescExpanded(true)}>더 보기</MoreBtn>
                            )}
                        </DescriptionBox>
                    </LeftCol>
                    <RightCol>
                        <ReserveForm>
                            <Price>₩{nightly.toLocaleString()} / 박</Price>
                            <ReserveInputRow>
                                <ReserveInput>
                                    <label>체크인</label>
                                    <input type="text" readOnly value={checkIn ? checkIn : '연도. 월. 일.'} />
                                </ReserveInput>
                                <ReserveInput>
                                    <label>체크아웃</label>
                                    <input type="text" readOnly value={checkOut ? checkOut : '연도. 월. 일.'} />
                                </ReserveInput>
                            </ReserveInputRow>
                            <ReserveInput style={{ width: '332px', maxWidth: '332px', marginBottom: '12px', marginLeft: 'auto', marginRight: 'auto' }}>
                                <label>인원</label>
                                <input type="text" readOnly value={guests} />
                            </ReserveInput>
                            <ReserveButton style={{marginTop: '18px'}} disabled={reserveLoading || !checkIn || !checkOut}>
                                {reserveLoading ? '조회 중...' : '예약하기'}
                            </ReserveButton>
                            <ReserveSummary>예약 확정 전에는 요금이 청구되지 않습니다.</ReserveSummary>
                            {checkIn && checkOut && (
                                <>
                                    <ReservePriceRow>
                                        <span>₩{nightly.toLocaleString()} x {nights}박</span>
                                        <span>₩{totalPrice.toLocaleString()}</span>
                                    </ReservePriceRow>
                                    <ReservePriceRow>
                                        <span>에어디엔디 서비스 수수료</span>
                                        <span>₩{serviceFee.toLocaleString()}</span>
                                    </ReservePriceRow>
                                    <hr style={{margin: '12px 0', border: 'none', borderTop: '1px solid #eee'}}/>
                                    <ReserveTotal>
                                        <span>총액</span>
                                        <span>₩{finalPrice.toLocaleString()}</span>
                                    </ReserveTotal>
                                </>
                            )}
                            {reserveError && <div style={{color: 'red', marginTop: '8px'}}>예약 정보를 불러올 수 없습니다.</div>}
                        </ReserveForm>
                    </RightCol>
                </MainRow>
                <Separator/>
                <MapSection>
                    <h2 style={{fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px'}}>위치</h2>
                    <MapBox>
                        <KakaoMap accommodations={mapMarkers} center={mapCenter}/>
                    </MapBox>
                    <Address>
                        {address.city} {address.district} {address.streetAddress}
                    </Address>
                </MapSection>
            </PageWrapper>
        </>
    );
};

export default AccommodationDetailPage;
