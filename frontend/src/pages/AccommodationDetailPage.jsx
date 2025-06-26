import React, {useEffect, useState, useMemo, useRef} from 'react';
import styled from 'styled-components';
import {useParams, useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import KakaoMap from '../components/KakaoMap';
import {getAccommodationDetail, getReservationInfo, createReservation, createChatRoom} from '../api/accommodationApi';
import { format } from 'date-fns';
import axios from 'axios';
import { loadTossPayments } from '@tosspayments/payment-sdk';

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
    max-height: ${({$expanded}) => $expanded ? 'none' : '3.2em'};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: ${({$expanded}) => $expanded ? 'unset' : 2};
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

const PaymentModalOverlay = styled.div`
    position: fixed;
    left: 0; top: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.18);
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const PaymentModalBox = styled.div`
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.13);
    padding: 36px 32px 32px 32px;
    min-width: 380px;
    max-width: 95vw;
    display: flex;
    flex-direction: column;
    gap: 18px;
`;
const ModalTitle = styled.div`
    font-size: 1.18rem;
    font-weight: bold;
    margin-bottom: 8px;
`;
const ModalRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.05rem;
    margin: 6px 0;
`;
const ModalSection = styled.div`
    margin: 12px 0 0 0;
`;
const ModalImage = styled.img`
    width: 90px;
    height: 90px;
    border-radius: 16px;
    object-fit: cover;
    margin-right: 18px;
`;
const ModalFlex = styled.div`
    display: flex;
    align-items: center;
`;
const ModalSub = styled.div`
    color: #888;
    font-size: 0.98rem;
    margin-bottom: 2px;
`;
const ModalTotal = styled.div`
    font-size: 1.18rem;
    font-weight: bold;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
`;
const PayButton = styled.button`
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

// 인증된 axios 인스턴스 생성
const authAxios = axios.create({
    baseURL: 'http://localhost:8080'
});

// 인증 헤더 추가 인터셉터
authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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
    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [reserveId, setReserveId] = useState(null);
    const [reserveBtnLoading, setReserveBtnLoading] = useState(false);
    const [reserveBtnDone, setReserveBtnDone] = useState(false);

    // 예약 form 상태
    const queryParams = location.state?.queryParams || {};
    const [checkIn] = useState(queryParams.checkIn || '');
    const [checkOut] = useState(queryParams.checkOut || '');
    const [guests] = useState(queryParams.guests || 1);

    const [menuOpen, setMenuOpen] = useState(false);
    const token = localStorage.getItem('accessToken');
    const user = parseJwt(token);
    const isLoggedIn = !!user;
    const guestId = user?.userId;

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

    const handleReserve = async () => {
        if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        setReserveBtnLoading(true);
        try {
            // 예약 생성
            const res = await createReservation(id, guestId, checkIn, checkOut, guests);
            setReserveId(res.data.reservationId);
            setReserveBtnDone(true);
            // 예약 응답에서 orderId, amount 등 바로 사용
            setPaymentInfo({
                orderId: res.data.orderId,
                amount: res.data.amount,
                title: data?.name || '숙소 예약',
                checkIn,
                checkOut,
                guestCount: guests,
                pricePerNight: reservationInfo?.pricePerNight || data.pricePerNight || 0,
                totalPrice: reservationInfo?.totalPrice || res.data.amount || 0,
                serviceFee: Math.round((reservationInfo?.totalPrice || res.data.amount || 0) * 0.1)
            });
            // 예약 성공 후 채팅방 생성
            createChatRoom(res.data.reservationId, guestId).catch(console.error);
            setPaymentModal(true);
        } catch (e) {
            alert('예약에 실패했습니다.');
        } finally {
            setReserveBtnLoading(false);
        }
    };
    const closePaymentModal = () => setPaymentModal(false);

    // 토스페이먼츠 결제 처리
    const handlePayment = async () => {
        if (!paymentInfo?.orderId) {
            alert('결제 정보에 주문번호가 없습니다.');
            return;
        }
        try {
            const tossPayments = await loadTossPayments(process.env.REACT_APP_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq');
            await tossPayments.requestPayment('카드', {
                amount: paymentInfo.amount,
                orderId: paymentInfo.orderId,
                orderName: `${paymentInfo.title} 예약`,
                customerName: '고객명',
                customerEmail: 'customer@example.com',
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
            });
        } catch (error) {
            console.error('결제 오류:', error);
            alert('결제 처리 중 오류가 발생했습니다.');
        }
    };

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
    // address가 없으면 서울 시청 좌표를 기본값으로 사용
    const mapCenter = address && address.latitude && address.longitude 
        ? {lat: address.latitude, lng: address.longitude} 
        : {lat: 37.5665, lng: 126.9780};
    const mapMarkers = address && address.latitude && address.longitude 
        ? [{latitude: address.latitude, longitude: address.longitude}] 
        : [];

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
                            <DescText $expanded={descExpanded}>{description}</DescText>
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
                            <ReserveButton
                                style={{marginTop: '18px'}}
                                disabled={reserveLoading || !checkIn || !checkOut || reserveBtnLoading || reserveBtnDone}
                                onClick={handleReserve}
                            >
                                {reserveBtnLoading ? '예약 중...' : reserveBtnDone ? '예약 완료' : '예약하기'}
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
                        {address && (address.city || address.district || address.streetAddress) 
                            ? `${address.city || ''} ${address.district || ''} ${address.streetAddress || ''}`.trim() 
                            : '주소 정보가 없습니다.'}
                    </Address>
                </MapSection>
            </PageWrapper>
            {paymentModal && paymentInfo && (
                <PaymentModalOverlay onClick={closePaymentModal}>
                    <PaymentModalBox onClick={e => e.stopPropagation()}>
                        <ModalFlex>
                            <ModalImage src={paymentInfo.imageUrl || 'https://via.placeholder.com/90'} alt={paymentInfo.title} />
                            <div>
                                <ModalTitle>{paymentInfo.title}</ModalTitle>
                                <div style={{fontSize:'1.05rem', color:'#888'}}>{paymentInfo.checkIn}~{paymentInfo.checkOut} · 성인 {paymentInfo.guestCount}명</div>
                            </div>
                        </ModalFlex>
                        <ModalSection>
                            <ModalSub>취소 수수료 없음</ModalSub>
                            <div style={{color:'#888', fontSize:'0.97rem'}}>7월 30일까지 예약을 취소하면 요금 전액이 환불됩니다.<br/>환불 정책 전문</div>
                        </ModalSection>
                        <hr style={{margin:'18px 0 10px 0', border:'none', borderTop:'1px solid #eee'}}/>
                        <ModalSection>
                            <ModalTitle>여행 세부 정보</ModalTitle>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <div>
                                    {paymentInfo.checkIn}~{paymentInfo.checkOut}<br/>
                                    성인 {paymentInfo.guestCount}명
                                </div>
                                <button style={{background:'#f5f5f5', border:'none', borderRadius:'12px', padding:'7px 22px', fontSize:'1rem', color:'#888', fontWeight:'bold', cursor:'not-allowed'}}>변경</button>
                            </div>
                        </ModalSection>
                        <hr style={{margin:'18px 0 10px 0', border:'none', borderTop:'1px solid #eee'}}/>
                        <ModalSection>
                            <ModalTitle>요금 세부 정보</ModalTitle>
                            <ModalRow>
                                <span>₩{paymentInfo.pricePerNight.toLocaleString()} x {Math.max(1, (new Date(paymentInfo.checkOut) - new Date(paymentInfo.checkIn))/(1000*60*60*24))}박</span>
                                <span>₩{paymentInfo.totalPrice.toLocaleString()}</span>
                            </ModalRow>
                            <ModalRow>
                                <span>에어비앤비 서비스 수수료</span>
                                <span>₩{paymentInfo.serviceFee.toLocaleString()}</span>
                            </ModalRow>
                        </ModalSection>
                        <hr style={{margin:'18px 0 10px 0', border:'none', borderTop:'1px solid #eee'}}/>
                        <ModalTotal>
                            <span>총액 <span style={{fontWeight:400}}>KRW</span></span>
                            <span>₩{(paymentInfo.totalPrice + paymentInfo.serviceFee).toLocaleString()}</span>
                        </ModalTotal>
                        <PayButton onClick={handlePayment}>결제하기</PayButton>
                        <div style={{color:'#888', fontSize:'0.97rem', marginTop:'8px', textAlign:'center', cursor:'pointer'}}>요금 상세 내역</div>
                    </PaymentModalBox>
                </PaymentModalOverlay>
            )}
        </>
    );
};

export default AccommodationDetailPage;
