import React, {useState} from 'react';
import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, getCurrentUser } from '../utils/auth';

const PageContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Header = styled.header`
    width: 100%;
    padding: 20px 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
`;

const Logo = styled.div`
    font-weight: bold;
    font-size: 24px;
    color: #FF385C;
`;

const Nav = styled.nav`
    display: flex;
    gap: 30px;
    font-size: 16px;
    font-weight: 500;
`;

const NavLink = styled.a`
    text-decoration: none;
    color: #222;
    cursor: pointer;
`;

const MainContent = styled.main`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const HeroSection = styled.div`
    width: 100%;
    height: 500px;
    background-image: url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2070&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40px;
    > div {
      min-width: 600px;
    }
`;

const Section = styled.section`
    width: 100%;
    max-width: 1200px;
    padding: 40px 80px;
    box-sizing: border-box;
`;

const SectionTitle = styled.h2`
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 30px;
`;

const Grid = styled.div`
    display: grid;
    gap: 20px;
`;

const LocationGrid = styled(Grid)`
    grid-template-columns: repeat(4, 1fr);
`;

const LocationItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 15px;

    img {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        object-fit: cover;
    }

    div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    strong {
        font-weight: 600;
    }

    span {
        color: #717171;
    }
`;

const ExperienceGrid = styled(Grid)`
    grid-template-columns: repeat(4, 1fr);
`;

const ExperienceItem = styled.div`
    img {
        width: 100%;
        height: 280px;
        border-radius: 10px;
        object-fit: cover;
        margin-bottom: 10px;
    }

    strong {
        font-size: 18px;
        font-weight: 600;
    }
`;

const Footer = styled.footer`
    width: 100%;
    background-color: #f7f7f7;
    padding: 40px 80px;
    box-sizing: border-box;
    margin-top: 40px;
`;

const FooterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

const FooterColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;

    h4 {
        font-weight: bold;
        margin-bottom: 10px;
    }

    a {
        color: #222;
        text-decoration: none;
    }
`;

const locations = [
    {name: '서울', distance: '차로 30분 거리'},
    {name: '의정부시', distance: '차로 30분 거리'},
    {name: '대구', distance: '차로 3.5시간 거리'},
    {name: '대전', distance: '차로 2시간 거리'},
    {name: '광주', distance: '차로 4시간 거리'},
    {name: '수원시', distance: '차로 45분 거리'},
    {name: '울산', distance: '차로 4.5시간 거리'},
    {name: '부천시', distance: '차로 45분 거리'},
];

const experiences = [
    {image: 'https://picsum.photos/300/300?random=1', title: '자연생활을 만끽할 수 있는 숙소'},
    {image: 'https://picsum.photos/300/300?random=2', title: '독특한 공간'},
    {image: 'https://picsum.photos/300/300?random=3', title: '집 전체'},
    {image: 'https://picsum.photos/300/300?random=4', title: '반려동물 동반 가능'},
];

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

const MainPage = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const isUserLoggedIn = isLoggedIn();
    const user = getCurrentUser();

    const handleMenuClick = () => setMenuOpen((v) => !v);
    const handleMenuClose = () => setMenuOpen(false);

    const handleDropdownClick = (action) => {
      handleMenuClose();
      if (action === 'login') {
        navigate('/login');
      } else if (action === 'messages') {
        if (isUserLoggedIn) {
          navigate('/chatroom');
        } else {
          alert('로그인이 필요합니다.');
          navigate('/login');
        }
      } else if (action === 'trips') {
        if (user?.userId) navigate(`/api/reservations/guest/${user.userId}/confirmed`);
      } else if (action === 'profile') {
        navigate('/profile');
      }
    };

    return (
        <PageContainer>
            <Header>
                <Logo style={{cursor:'pointer'}} onClick={() => navigate('/')}>AirDND</Logo>
                <Nav>
                    <NavLink>숙소</NavLink>
                    <NavLink>체험</NavLink>
                    <NavLink>온라인 체험</NavLink>
                </Nav>
                <UserMenuContainer>
                  <UserButton onClick={handleMenuClick}>
                    <span style={{fontSize:'20px'}}>☰</span>
                    {isUserLoggedIn && user?.profileImage ? (
                      <UserIcon>
                        <img 
                          src={user.profileImage} 
                          alt="프로필" 
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      </UserIcon>
                    ) : (
                      <UserIcon> <span role="img" aria-label="user">👤</span> </UserIcon>
                    )}
                  </UserButton>
                  {menuOpen && (
                    <DropdownMenu onMouseLeave={handleMenuClose}>
                      {!isUserLoggedIn ? (
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
            </Header>
            <MainContent>
                <HeroSection>
                    <SearchBar/>
                </HeroSection>
                <Section>
                    <SectionTitle>가까운 여행지 둘러보기</SectionTitle>
                    <LocationGrid>
                        {locations.map((loc, i) => (
                            <LocationItem key={i}>
                                <img src={`https://picsum.photos/60/60?random=${i + 10}`} alt={loc.name}/>
                                <div>
                                    <strong>{loc.name}</strong>
                                    <span>{loc.distance}</span>
                                </div>
                            </LocationItem>
                        ))}
                    </LocationGrid>
                </Section>
                <Section>
                    <SectionTitle>어디서나, 여행은 살아보는 거야!</SectionTitle>
                    <ExperienceGrid>
                        {experiences.map((exp, i) => (
                            <ExperienceItem key={i}>
                                <img src={exp.image} alt={exp.title}/>
                                <strong>{exp.title}</strong>
                            </ExperienceItem>
                        ))}
                    </ExperienceGrid>
                </Section>
            </MainContent>
            <Footer>
                <FooterGrid>
                    <FooterColumn>
                        <h4>소개</h4>
                        <a href="#">뉴스룸</a>
                        <a href="#">새로운 기능</a>
                        <a href="#">채용정보</a>
                    </FooterColumn>
                    <FooterColumn>
                        <h4>커뮤니티</h4>
                        <a href="#">다양성 및 소속감</a>
                        <a href="#">게스트 추천</a>
                    </FooterColumn>
                    <FooterColumn>
                        <h4>호스팅하기</h4>
                        <a href="#">숙소 호스팅</a>
                        <a href="#">책임감 있는 호스팅</a>
                    </FooterColumn>
                </FooterGrid>
            </Footer>
        </PageContainer>
    );
};

export default MainPage;
