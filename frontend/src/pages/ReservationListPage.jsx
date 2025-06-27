import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getConfirmedReservations } from '../api/accommodationApi';

const PageWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 0;
`;
const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 32px;
  text-align: center;
`;
const ReservationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
`;
const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 28px 24px 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const CardTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 8px;
`;
const CardRow = styled.div`
  font-size: 1.05rem;
  margin-bottom: 4px;
`;
const Status = styled.span`
  display: inline-block;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #28a745;
  border-radius: 8px;
  padding: 2px 12px;
  margin-left: 8px;
`;
const MoreBtn = styled.button`
  margin-top: 12px;
  background: #f7f7f7;
  border: none;
  border-radius: 8px;
  padding: 7px 18px;
  font-size: 1rem;
  color: #444;
  cursor: pointer;
  &:hover { background: #eee; }
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalBox = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 32px 28px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
`;
const CloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 24px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
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
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function ReservationListPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('accessToken');
  const user = parseJwt(token);
  const isLoggedIn = !!user;
  const guestId = user?.userId;

  useEffect(() => {
    setLoading(true);
    getConfirmedReservations()
      .then(res => setReservations(res.data))
      .catch(e => setError(e))
      .finally(() => setLoading(false));
  }, []);

  const handleMore = (reservation) => {
    setModalData(reservation);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

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

  return (
    <>
      <Navbar>
        <Logo onClick={() => navigate('/')}>AirDND</Logo>
        <div style={{flex: 1}}/>
        <UserMenuContainer>
          <UserButton onClick={handleMenuClick}>
            <span style={{fontSize: '20px'}}>☰</span>
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
        <Title>내 여행</Title>
        {loading && <div>불러오는 중...</div>}
        {error && <div style={{color:'red'}}>예약 정보를 불러올 수 없습니다.</div>}
        <ReservationGrid>
          {reservations.map(rsv => (
            <Card key={rsv.reservationId}>
              <CardTitle>{rsv.accommodationName}
                <Status>{rsv.status}</Status>
              </CardTitle>
              <CardRow>체크인: {rsv.checkIn}</CardRow>
              <CardRow>체크아웃: {rsv.checkOut}</CardRow>
              <MoreBtn onClick={() => handleMore(rsv)}>더보기</MoreBtn>
            </Card>
          ))}
        </ReservationGrid>
        {modalOpen && modalData && (
          <ModalOverlay onClick={closeModal}>
            <ModalBox onClick={e => e.stopPropagation()} style={{position:'relative', minWidth:380}}>
              <CloseBtn onClick={closeModal}>×</CloseBtn>
              <h3 style={{marginTop:0, marginBottom:18}}>예약 상세 정보</h3>
              {modalData.coverImageUrl && (
                <img src={modalData.coverImageUrl} alt="숙소 이미지" style={{width:'100%', maxHeight:180, objectFit:'cover', borderRadius:12, marginBottom:18}} />
              )}
              <div style={{fontWeight:'bold', fontSize:'1.2rem', marginBottom:8}}>{modalData.accommodationName}</div>
              <div style={{marginBottom:6}}>예약상태: <Status>{modalData.status}</Status></div>
              <div style={{marginBottom:6}}>체크인: <b>{modalData.checkIn}</b></div>
              <div style={{marginBottom:6}}>체크아웃: <b>{modalData.checkOut}</b></div>
              <div style={{marginBottom:6}}>결제금액: <b>₩{modalData.totalPrice?.toLocaleString?.() ?? modalData.totalPrice}</b></div>
              {modalData.serviceFee !== undefined && (
                <div style={{marginBottom:6}}>서비스 수수료: <b>₩{modalData.serviceFee?.toLocaleString?.() ?? modalData.serviceFee}</b></div>
              )}
              {modalData.createdAt && (
                <div style={{marginBottom:6}}>예약일시: <b>{modalData.createdAt.replace('T',' ').replace(/:..$/,'')}</b></div>
              )}
            </ModalBox>
          </ModalOverlay>
        )}
      </PageWrapper>
    </>
  );
}

export default ReservationListPage; 