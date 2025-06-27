import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import axios from 'axios';

// 인증된 axios 인스턴스 생성
const authAxios = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'
});

// 인증 헤더 추가 인터셉터
authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const Sidebar = styled.div`
  width: 340px;
  background: #fafafa;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  padding: 28px 24px 12px 24px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
`;
const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 24px 12px 24px;
`;
const Tab = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #888;
  padding: 6px 18px;
  border-radius: 20px;
  cursor: pointer;
  ${({active}) => active && css`
    background: #fff;
    color: #ff385c;
    border: 1.5px solid #ff385c;
  `}
`;
const SearchBox = styled.div`
  padding: 0 24px 16px 24px;
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #eee;
  font-size: 1rem;
  background: #fff;
`;
const RoomList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 0 8px 0;
`;
const RoomItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 24px;
  cursor: pointer;
  background: ${({selected}) => selected ? '#fff' : 'transparent'};
  border-left: ${({selected}) => selected ? '4px solid #ff385c' : '4px solid transparent'};
  &:hover {
    background: #f5f5f5;
  }
`;
const ProfileImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: #eee;
`;
const RoomInfo = styled.div`
  flex: 1;
  min-width: 0;
`;
const RoomName = styled.div`
  font-weight: 600;
  font-size: 1.08rem;
  color: #222;
  display: flex;
  align-items: center;
`;
const LastMessage = styled.div`
  color: #888;
  font-size: 0.97rem;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: ${({unread}) => unread ? 'bold' : 'normal'};
`;
const UnreadBadge = styled.div`
  min-width: 22px;
  height: 22px;
  background: #ff385c;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: bold;
  margin-left: 8px;
`;

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

export default function ChatRoomList({ selectedRoom, setSelectedRoom }) {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // JWT에서 사용자 ID 파싱
  const token = localStorage.getItem('accessToken');
  const user = parseJwt(token);
  const userId = user?.userId || 2; // 기본값 2 (로그인하지 않은 경우)

  useEffect(() => {
    setLoading(true);
    authAxios.get('/api/chat/rooms', {
      params: { unreadOnly: filter === 'unread' }
    })
      .then(res => setRooms(res.data.data || []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const filteredRooms = rooms.filter(room =>
    !search || room.otherUserName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Sidebar>
      <Header>메시지</Header>
      <FilterTabs>
        <Tab active={filter === 'all'} onClick={() => setFilter('all')}>
          모든 메시지
        </Tab>
        <Tab active={filter === 'unread'} onClick={() => setFilter('unread')}>
          읽지 않음
        </Tab>
      </FilterTabs>
      <SearchBox>
        <SearchInput
          placeholder="사용자 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBox>
      <RoomList>
        {loading ? (
          <div style={{padding: '20px', textAlign: 'center', color: '#888'}}>로딩 중...</div>
        ) : filteredRooms.length === 0 ? (
          <div style={{padding: '20px', textAlign: 'center', color: '#888'}}>
            {filter === 'unread' ? '읽지 않은 메시지가 없습니다' : '채팅방이 없습니다'}
          </div>
        ) : (
          filteredRooms.map(room => (
            <RoomItem
              key={room.roomId}
              selected={selectedRoom?.roomId === room.roomId}
              onClick={() => setSelectedRoom(room)}
            >
              <ProfileImg src={room.otherUserProfileUrl || 'https://via.placeholder.com/48'} alt={room.otherUserName} />
              <RoomInfo>
                <RoomName>
                  {room.otherUserName}
                  {room.unreadCount > 0 && <UnreadBadge>{room.unreadCount}</UnreadBadge>}
                </RoomName>
                <LastMessage unread={room.unreadCount > 0}>
                  {room.lastMessage}
                </LastMessage>
              </RoomInfo>
            </RoomItem>
          ))
        )}
      </RoomList>
    </Sidebar>
  );
} 
