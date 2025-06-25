import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import KakaoMap from '../components/KakaoMap';
import { getAccommodationDetail } from '../api/accommodationApi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 80px 16px;
  @media (max-width: 768px) {
    padding: 12px 4px 80px 4px;
  }
`;
const ImageSlider = styled.div`
  width: 100%;
  height: 340px;
  display: flex;
  overflow-x: auto;
  gap: 8px;
  margin-bottom: 24px;
  img {
    height: 100%;
    border-radius: 12px;
    object-fit: cover;
    min-width: 320px;
    max-width: 100%;
  }
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px;
`;
const Price = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: #ff385c;
  margin-bottom: 8px;
`;
const InfoRow = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;
const Section = styled.section`
  margin-bottom: 32px;
`;
const Amenities = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    background: #f7f7f7;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 0.95rem;
  }
`;
const HostInfo = styled.div`
  margin-bottom: 16px;
  font-size: 1.1rem;
`;
const ReviewSection = styled.div`
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
const MapSection = styled.div`
  margin-bottom: 32px;
`;
const Address = styled.div`
  margin-top: 8px;
  color: #555;
`;
const FixedReserveButton = styled.button`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  max-width: 100vw;
  background: #ff385c;
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  padding: 20px 0;
  border: none;
  z-index: 100;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.07);
  @media (min-width: 900px) {
    left: 50%;
    transform: translateX(-50%);
    width: 900px;
    max-width: 900px;
  }
`;

const AccommodationDetailPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <Container>로딩 중...</Container>;
    if (error) return <Container>오류가 발생했습니다.</Container>;
    if (!data) return null;

    const { name, imageUrls, amenities, hostId, description, pricePerNight, maxGuests, bedCount, address, reviews } = data;

    return (
        <Container>
            <ImageSlider>
                {imageUrls && imageUrls.map(img => (
                    <img key={img.id} src={img.imageUrl} alt={name} />
                ))}
            </ImageSlider>
            <Title>{name}</Title>
            <Price>₩{pricePerNight.toLocaleString()} / 박</Price>
            <InfoRow>
                <div>최대 인원: {maxGuests}명</div>
                <div>침대: {bedCount}개</div>
            </InfoRow>
            <Section>
                <div>{description}</div>
            </Section>
            <Section>
                <HostInfo>호스트 ID: {hostId}</HostInfo>
                <Amenities>
                    {amenities && amenities.map(a => <li key={a.id}>{a.name}</li>)}
                </Amenities>
            </Section>
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
            <MapSection>
                <div style={{ height: '320px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                    <KakaoMap accommodations={[{ latitude: address.latitude, longitude: address.longitude }]} />
                </div>
                <Address>
                    {address.city} {address.district} {address.streetAddress}
                </Address>
            </MapSection>
            <FixedReserveButton>예약하기</FixedReserveButton>
        </Container>
    );
};

export default AccommodationDetailPage;
