import React, { useState } from 'react';
import styled from 'styled-components';
import ChatRoomList from './ChatRoomList';
import ChatRoomDetail from './ChatRoomDetail';

const SplitLayout = styled.div`
  display: flex;
  height: 90vh;
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
`;

export default function ChatPage() {
  // TODO: Replace with JWT parsing
  const [userId] = useState(1); // 임시 userId
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <SplitLayout>
      <ChatRoomList userId={userId} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
      <ChatRoomDetail userId={userId} room={selectedRoom} />
    </SplitLayout>
  );
} 