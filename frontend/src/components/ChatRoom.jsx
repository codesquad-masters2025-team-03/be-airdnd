import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import axios from 'axios';

// 하드코딩된 테스트 값 (실제 환경에 따라 교체 필요)
const RESERVATION_ID = 1;
const SENDER_ID = 2;
const ACCOMMODATION_ID = 100;

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [client, setClient] = useState(null);
    const [partnerName, setPartnerName] = useState('상대방 이름');
    const [partnerProfileUrl, setPartnerProfileUrl] = useState(null);
    const messagesEndRef = useRef(null);

    // 1. 채팅방 생성 요청 (예약 완료 후)
    useEffect(() => {
        axios.post('/api/chat/rooms', {
            reservationId: RESERVATION_ID,
            senderId: SENDER_ID,
        }).catch(console.error);
    }, []);

    // 2. 과거 메시지 불러오기
    useEffect(() => {
        axios.get(`/api/chat/rooms/${ACCOMMODATION_ID}/messages`)
            .then((res) => {
                setMessages(res.data.data || []);
            }).catch(console.error);
    }, []);

    // 3. WebSocket 연결 및 구독
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws/chat');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            console.log('🟢 WebSocket 연결 성공');
            stompClient.subscribe(`/sub/chat/room/${ACCOMMODATION_ID}`, (msg) => {
                const newMessage = JSON.parse(msg.body);
                setMessages(prev => [...prev, newMessage]);
            });
        }, (error) => {
            console.error('🔴 WebSocket 연결 실패:', error);
        });

        setClient(stompClient);

        return () => {
            if (stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log('🟡 WebSocket 연결 종료');
                });
            }
        };
    }, []);

    // 4. 스크롤 항상 아래로
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    // 5. 메시지 전송
    const sendMessage = () => {
        if (client && input.trim()) {
            const payload = {
                accommodationId: ACCOMMODATION_ID,
                senderId: SENDER_ID,
                content: input.trim(),
            };
            client.send('/pub/chat/message', {}, JSON.stringify(payload));

            // 낙관적 UI 적용 (선택사항)
            setMessages(prev => [...prev, {
                senderId: SENDER_ID,
                senderName: '나',
                content: input.trim(),
            }]);

            setInput('');
        }
    };

    return (
        <Container>
            <Header>
                {partnerProfileUrl && <ProfileImg src={partnerProfileUrl} alt="상대방 프로필"/>}
                <PartnerName>{partnerName}</PartnerName>
            </Header>
            <MessageContainer>
                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} isMe={msg.senderId === SENDER_ID}>
                        <Sender>{msg.senderName}</Sender>
                        <Content>{msg.content}</Content>
                    </MessageBubble>
                ))}
                <div ref={messagesEndRef}/>
            </MessageContainer>
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
};

export default ChatRoom;

// 스타일링
const Container = styled.div`
    width: 400px;
    height: 600px;
    border: 1px solid #ddd;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    height: 60px;
    background-color: #f7f7f7;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    padding: 0 16px;
`;

const ProfileImg = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 12px;
`;

const PartnerName = styled.div`
    font-weight: bold;
    font-size: 16px;
`;

const MessageContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    background: #fafafa;
`;

const MessageBubble = styled.div`
    align-self: ${props => (props.isMe ? 'flex-end' : 'flex-start')};
    background: ${props => (props.isMe ? '#cce4ff' : '#eee')};
    color: #000;
    padding: 8px 12px;
    border-radius: 12px;
    margin: 5px 0;
    max-width: 70%;
`;

const Sender = styled.div`
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 4px;
`;

const Content = styled.div`
    font-size: 14px;
`;

const InputBox = styled.div`
    display: flex;
    border-top: 1px solid #ddd;
    padding: 10px;
`;

const Input = styled.input`
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
`;

const SendButton = styled.button`
    margin-left: 8px;
    padding: 8px 12px;
    background-color: #ff385c;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
`;
