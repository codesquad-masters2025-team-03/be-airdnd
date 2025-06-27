import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const NavbarWrap = styled.nav`
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

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const user = parseJwt(token);
    const isLoggedIn = !!user;
    const guestId = user?.userId;

    const handleMenuClick = () => setMenuOpen((v) => !v);
    const handleMenuClose = () => setMenuOpen(false);
    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        } catch (e) {}
        localStorage.removeItem('accessToken');
        navigate('/');
    };
    const handleDropdownClick = (action) => {
        handleMenuClose();
        if (action === 'login') {
            navigate('/login');
        } else if (action === 'signup') {
            navigate('/signup');
        } else if (action === 'messages') {
            navigate('/chatroom');
        } else if (action === 'trips') {
            navigate('/reservations');
        } else if (action === 'profile') {
            navigate('/profile');
        } else if (action === 'ai-chat') {
            navigate('/ai-chat');
        }
    };

    return (
        <NavbarWrap>
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
                            <>
                                <DropdownItem onClick={() => handleDropdownClick('login')}>로그인</DropdownItem>
                                <DropdownItem onClick={() => handleDropdownClick('signup')}>회원가입</DropdownItem>
                            </>
                        ) : (
                            <>
                                <DropdownItem onClick={() => handleDropdownClick('messages')}>메시지</DropdownItem>
                                <DropdownItem onClick={() => handleDropdownClick('trips')}>내 여행</DropdownItem>
                                <DropdownItem onClick={() => handleDropdownClick('profile')}>프로필</DropdownItem>
                                <DropdownItem onClick={() => handleDropdownClick('ai-chat')}>여행지 추천받기</DropdownItem>
                                <DropdownItem onClick={handleLogout}>로그아웃</DropdownItem>
                            </>
                        )}
                    </DropdownMenu>
                )}
            </UserMenuContainer>
        </NavbarWrap>
    );
};

export default Navbar; 