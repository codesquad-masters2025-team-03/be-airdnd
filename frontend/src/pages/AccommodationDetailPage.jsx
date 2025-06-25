import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import KakaoMap from '../components/KakaoMap';
import { getAccommodationDetail } from '../api/accommodationApi';
import { FaWifi, FaTv, FaSnowflake, FaSwimmer, FaParking, FaDumbbell, FaUtensils, FaTshirt, FaFireAlt } from 'react-icons/fa';
import { MdKitchen, MdLocalLaundryService, MdAcUnit, MdOutlineLocalParking, MdOutlinePool, MdOutlineTv, MdOutlineWifi, MdOutlineFitnessCenter, MdOutlineKitchen, MdOutlineLocalLaundryService, MdOutlineFireplace, MdOutlineDry, MdOutlineBathroom, MdOutlineDirectionsCar } from 'react-icons/md';

const PageWrapper = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 12px 0 60px 0;
  @media (max-width: 900px) {
    padding: 4px 0 60px 0;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 220px 220px;
  gap: 8px;
  margin-bottom: 32px;
  @media (max-width: 900px) {
    display: flex;
    overflow-x: auto;
    height: 220px;
    img { min-width: 220px; height: 100%; }
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
  &:first-child { border-radius: 0 16px 0 0; }
  &:nth-child(2) { border-radius: 0 0 16px 0; }
`;

const ContentRow = styled.div`
  display: flex;
  gap: 40px;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 24px;
  }
`;
const InfoSection = styled.section`
  flex: 2;
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 4px;
`;
const Summary = styled.div`
  color: #555;
  font-size: 1.08rem;
  margin-bottom: 18px;
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
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
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
  WIFI: <MdOutlineWifi size={20} />,
  TV: <MdOutlineTv size={20} />,
  AIR_CONDITIONER: <MdAcUnit size={20} />,
  HAIR_DRYER: <MdOutlineDry size={20} />,
  POOL: <MdOutlinePool size={20} />,
  PARKING: <MdOutlineDirectionsCar size={20} />,
  GYM: <MdOutlineFitnessCenter size={20} />,
  KITCHEN: <MdOutlineKitchen size={20} />,
  LAUNDRY: <MdOutlineLocalLaundryService size={20} />,
  HEATER: <MdOutlineFireplace size={20} />,
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
`;
const DescText = styled.div`
  font-size: 1.1rem;
  line-height: 1.5;
  max-height: ${({expanded}) => expanded ? 'none' : '3.2em'};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${({expanded}) => expanded ? 'unset' : 2};
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

const AccommodationDetailPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [descExpanded, setDescExpanded] = useState(false);

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

    if (loading) return <PageWrapper>로딩 중...</PageWrapper>;
    if (error) return <PageWrapper>오류가 발생했습니다.</PageWrapper>;
    if (!data) return null;

    const { name, imageUrls, amenities, host, description, pricePerNight, maxGuests, bedCount, address, reviews } = data;
    // host: { hostId, hostName, hostProfileUrl, hostCareerDesc }
    const mainImg = imageUrls && imageUrls[0]?.imageUrl;
    const subImgs = imageUrls ? imageUrls.slice(1, 5) : [];

    // 지도 중심을 숙소 위치로 고정
    const mapCenter = { lat: address.latitude, lng: address.longitude };
    const mapMarkers = [{ latitude: address.latitude, longitude: address.longitude }];

    return (
        <PageWrapper>
            {/* 이미지 그리드 */}
            <ImageGrid>
                {mainImg && <MainImage src={mainImg} alt={name} />}
                {subImgs.map((img, i) => (
                    <SubImage key={img.id} src={img.imageUrl} alt={name + i} style={i === 0 ? {gridColumn:2,gridRow:1} : i === 1 ? {gridColumn:3,gridRow:1} : i === 2 ? {gridColumn:2,gridRow:2} : {gridColumn:3,gridRow:2}} />
                ))}
            </ImageGrid>
            <ContentRow style={{marginTop: '-4px'}}>
                <InfoSection>
                    <Title>{name}</Title>
                    <Summary>최대 인원 {maxGuests}명 · 침대 {bedCount}개</Summary>
                    <Separator />
                    <AmenitiesList>
                        {amenities && amenities.map(a => (
                            <li key={a.id}>{AMENITY_ICONS[a.name] || null}{a.name}</li>
                        ))}
                    </AmenitiesList>
                    <Separator />
                    <HostBox>
                        <HostProfile src={host?.hostProfileUrl || 'https://via.placeholder.com/56'} alt={host?.hostName} />
                        <HostInfoCol>
                            <HostName>호스트: {host?.hostName || '알 수 없음'}</HostName>
                            <HostDesc>{host?.hostCareerDesc || ''}</HostDesc>
                        </HostInfoCol>
                    </HostBox>
                    <Separator />
                    <DescriptionBox>
                        <DescText expanded={descExpanded}>{description}</DescText>
                        {!descExpanded && description && description.length > 0 && (
                            <MoreBtn onClick={() => setDescExpanded(true)}>더 보기</MoreBtn>
                        )}
                    </DescriptionBox>
                    <Separator />
                    <ReviewSection>
                        <ReviewHeader>평점 {reviews?.avgRating ?? '-'} / 5 ({reviews?.reviewSize ?? 0}개 후기)</ReviewHeader>
                        <ReviewList>
                            {reviews?.comments?.map(c => (
                                <ReviewCard key={c.commentId}>
                                    <ProfileImg src={c.profileUrl} alt={c.guestName} />
                                    <ReviewContent>
                                        <div style={{ fontWeight: 'bold' }}>{c.guestName}</div>
                                        <div style={{ color: '#888', fontSize: '0.95em' }}>{new Date(c.createdAt).toLocaleDateString()}</div>
                                        <div style={{ margin: '8px 0' }}>{c.content}</div>
                                        <div>⭐ {c.rating}</div>
                                    </ReviewContent>
                                </ReviewCard>
                            ))}
                        </ReviewList>
                    </ReviewSection>
                </InfoSection>
                <ReserveBox>
                    <Price>₩{pricePerNight.toLocaleString()} / 박</Price>
                    <div style={{marginBottom:'8px', color:'#555'}}>날짜와 인원을 선택하세요</div>
                    {/* 예약 폼(날짜, 인원 등) 추가 가능 */}
                    <ReserveButton>예약하기</ReserveButton>
                </ReserveBox>
            </ContentRow>
            <MapSection>
                <h2 style={{fontSize:'1.2rem', fontWeight:'bold', marginBottom:'12px'}}>위치</h2>
                <MapBox>
                    <KakaoMap accommodations={mapMarkers} center={mapCenter} />
                </MapBox>
                <Address>
                    {address.city} {address.district} {address.streetAddress}
                </Address>
            </MapSection>
        </PageWrapper>
    );
};

export default AccommodationDetailPage;
