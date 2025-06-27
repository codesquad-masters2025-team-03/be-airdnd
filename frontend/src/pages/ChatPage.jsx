import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ChatRoomList from '../components/ChatRoomList';
import ChatRoomDetail from '../components/ChatRoomDetail';
import Navbar from '../components/Navbar';

// JWT 파싱 함수
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

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #fafafa;
`;

const ChatPage = () => {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // 로그인 상태 확인
  const token = localStorage.getItem('accessToken');
  const user = parseJwt(token);
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null; // 리다이렉트 중
  }

  return (
    <>
      <Navbar />
      <Container>
        <ChatRoomList 
          selectedRoom={selectedRoom} 
          setSelectedRoom={setSelectedRoom} 
        />
        <ChatRoomDetail room={selectedRoom} />
      </Container>
    </>
  );
};

export default ChatPage; 