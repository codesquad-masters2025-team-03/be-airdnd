import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 32px 0 0 0;
  display: flex;
  flex-direction: column;
  height: 90vh;
`;
const ChatBox = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 0 12px 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
const BubbleRow = styled.div`
  display: flex;
  justify-content: ${({isMe}) => isMe ? 'flex-end' : 'flex-start'};
`;
const Bubble = styled.div`
  background: ${({isMe}) => isMe ? '#ff385c' : '#f5f5f5'};
  color: ${({isMe}) => isMe ? '#fff' : '#222'};
  padding: 13px 18px;
  border-radius: 18px;
  font-size: 1.08rem;
  max-width: 70%;
  word-break: break-word;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
`;
const InputBox = styled.div`
  display: flex;
  gap: 10px;
  padding: 18px 0;
  border-top: 1px solid #eee;
`;
const Input = styled.input`
  flex: 1;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px 16px;
  outline: none;
`;
const SendButton = styled.button`
  background: #ff385c;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0 22px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
`;
const DateDivider = styled.div`
  text-align: center;
  color: #aaa;
  font-size: 0.98rem;
  margin: 18px 0 0 0;
`;

const FIRST_AI_MSG = '안녕하세요! 👋 여행지 추천 도우미 AI예요.\n가족, 친구, 연인 누구와 떠나든 딱 맞는 여행지를 추천해드릴 수 있어요!\n어떤 여행을 원하시나요? (예: 12월 가족여행, 아이와 함께, 바다 근처 등)';

function AiChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    // 진입 시 이전 대화 불러오기
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/chat/logs', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const logs = await res.json();
        if (logs.length > 0) {
          // createdAt 오름차순 정렬
          logs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          const loadedMsgs = [];
          logs.forEach(log => {
            loadedMsgs.push({ sender: 'me', content: log.question });
            loadedMsgs.push({ sender: 'ai', content: log.answer });
          });
          setMessages(loadedMsgs);
        } else {
          setMessages([{ sender: 'ai', content: FIRST_AI_MSG }]);
        }
      } catch (e) {
        setMessages([{ sender: 'ai', content: FIRST_AI_MSG }]);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    // 스크롤 항상 아래로
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages(msgs => [...msgs, { sender: 'me', content: userMsg }]);
    setInput('');
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { sender: 'ai', content: data.reply }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: 'ai', content: 'AI 답변을 불러오지 못했습니다. 다시 시도해 주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <Navbar />
      <Container>
        <ChatBox ref={chatRef}>
          <DateDivider>{new Date().toLocaleDateString()}</DateDivider>
          {messages.map((msg, i) => (
            <BubbleRow key={i} isMe={msg.sender === 'me'}>
              {msg.sender === 'ai' ? (
                <Bubble isMe={false} dangerouslySetInnerHTML={{
                  __html: msg.content.replace(/\n/g, '<br/>').replace(/  /g, '&nbsp;&nbsp;')
                }} />
              ) : (
                <Bubble isMe>{msg.content}</Bubble>
              )}
            </BubbleRow>
          ))}
        </ChatBox>
        <InputBox>
          <Input
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <SendButton onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? '...' : '전송'}
          </SendButton>
        </InputBox>
      </Container>
    </>
  );
}

export default AiChatPage; 