import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
`;
const Header = styled.div`
  height: 72px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 32px;
`;
const ProfileImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: #eee;
`;
const UserName = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #222;
`;
const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px 16px 40px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const MessageRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({isMe}) => isMe ? 'flex-end' : 'flex-start'};
`;
const Bubble = styled.div`
  background: ${({isMe}) => isMe ? '#ff385c' : '#f5f5f5'};
  color: ${({isMe}) => isMe ? '#fff' : '#222'};
  padding: 12px 18px;
  border-radius: 18px;
  font-size: 1.08rem;
  max-width: 60%;
  margin-bottom: 4px;
  word-break: break-word;
`;
const Time = styled.div`
  font-size: 0.92rem;
  color: #aaa;
  margin-top: 2px;
`;
const InputBox = styled.div`
  border-top: 1px solid #eee;
  padding: 18px 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
`;
const Input = styled.input`
  flex: 1;
  padding: 12px 18px;
  border-radius: 24px;
  border: 1.5px solid #eee;
  font-size: 1.08rem;
  background: #fafafa;
`;
const SendButton = styled.button`
  background: #ff385c;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 10px 24px;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
`;

function formatTime(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

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

export default function ChatRoomDetail({ room }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [client, setClient] = useState(null);
  const messagesEndRef = useRef(null);

  // JWT에서 사용자 ID 파싱
  const token = localStorage.getItem('accessToken');
  const user = parseJwt(token);
  const userId = user?.userId || 2; // 기본값 2 (로그인하지 않은 경우)


  // 메시지 불러오기
  useEffect(() => {
    if (!room) return;
    axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/api/chat/rooms/${room.roomId}/messages`)
      .then(res => setMessages(res.data.data || []));
    // 읽음 처리
    axios.post(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/api/chat/rooms/${room.roomId}/read`).catch(()=>{});
  }, [room]);

  // WebSocket 연결 및 구독
  useEffect(() => {
    if (!room) return;
    const socket = new SockJS(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/ws/chat`);
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe(`/sub/chat/accommodation/${room.roomId}`, (msg) => {
        const newMessage = JSON.parse(msg.body);
        setMessages(prev => [...prev, newMessage]);
      });
    });
    setClient(stompClient);
    return () => {
      if (stompClient.connected) stompClient.disconnect();
    };
  }, [room]);

  // 스크롤 항상 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  const sendMessage = () => {
    if (client && input.trim() && room) {
      const payload = {
        reservationId: room.roomId,
        senderId: userId,
        content: input.trim(),
      };
      client.send('/pub/chat/message', {}, JSON.stringify(payload));
      setMessages(prev => [...prev, {
        senderId: userId,
        content: input.trim(),
        createdAt: new Date().toISOString(),
      }]);
      setInput('');
    }
  };

  if (!room) {
    return <Container style={{alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:'1.2rem'}}>채팅방을 선택하세요</Container>;
  }

  return (
    <Container>
      <Header>
        <ProfileImg src={room.otherUserProfileUrl || 'https://via.placeholder.com/48'} alt={room.otherUserName} />
        <UserName>{room.otherUserName}</UserName>
      </Header>
      <MessageList>
        {messages.map((msg, idx) => (
          <MessageRow key={idx} isMe={msg.senderId === userId}>
            <Bubble isMe={msg.senderId === userId}>
              {msg.content}
            </Bubble>
            <Time>{formatTime(msg.createdAt)}</Time>
          </MessageRow>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>
      <InputBox>
        <Input
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <SendButton onClick={sendMessage}>전송</SendButton>
      </InputBox>
    </Container>
  );
} 