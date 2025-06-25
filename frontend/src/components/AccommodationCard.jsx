import React from 'react';
import styled from 'styled-components';
import { FaRegHeart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CardContainer = styled.div`
    display: flex;
    padding: 16px 0;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
`;

const ImageContainer = styled.div`
    width: 300px;
    height: 200px;
    flex-shrink: 0;
    margin-right: 16px;
    border-radius: 12px;
    overflow: hidden;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    position: relative;
`;

const InfoHeader = styled.div`
    font-size: 14px;
    color: #717171;
`;

const Title = styled.h3`
    font-size: 18px;
    font-weight: 600;
    margin: 8px 0;
    color: #222;
`;

const Options = styled.div`
    font-size: 14px;
    color: #717171;
`;

const WishlistButton = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 24px;
    color: #ff385c;
`;

const InfoFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

const Rating = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    
    svg {
        color: #ff385c;
        margin-right: 4px;
    }
`;

const Price = styled.div`
    text-align: right;

    .price-per-night {
        font-size: 18px;
        font-weight: 600;
    }

    .total-price {
        font-size: 14px;
        color: #717171;
        text-decoration: underline;
    }
`;

const AccommodationCard = ({ accommodation, queryParams }) => {
    const navigate = useNavigate();
    const {
        id,
        name,
        imageUrl,
        description,
        pricePerNight,
        rating,
        reviewCount,
    } = accommodation;

    // 날짜 정보를 이용해 총 숙박일수 계산
    const calculateNights = () => {
        if (queryParams?.checkIn && queryParams?.checkOut) {
            const checkIn = new Date(queryParams.checkIn);
            const checkOut = new Date(queryParams.checkOut);
            const diffTime = Math.abs(checkOut - checkIn);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        return 0;
    };

    const nights = calculateNights();
    const totalPrice = nights > 0 ? pricePerNight * nights : 0;

    return (
        <CardContainer onClick={() => navigate(`/accommodations/${id}`, { state: { queryParams } })}>
            <ImageContainer>
                <img src={imageUrl || 'https://via.placeholder.com/300x200'} alt={name}/>
            </ImageContainer>
            <InfoContainer>
                <div>
                    <InfoHeader>{description}</InfoHeader>
                    <Title>{name}</Title>
                    <Options>침실 1개 · 침대 1개 · 욕실 1개</Options> {/* Mock Data */}
                </div>
                <WishlistButton onClick={(e) => {
                    e.stopPropagation();
                    console.log('Wishlist clicked!');
                }}>
                    <FaRegHeart />
                </WishlistButton>
                <InfoFooter>
                    <Rating>
                        <FaStar/>
                        {rating} ({reviewCount})
                    </Rating>
                    <Price>
                        <div className="price-per-night">₩{pricePerNight.toLocaleString()} / 박</div>
                        {totalPrice > 0 && (
                            <div className="total-price">총 ₩{totalPrice.toLocaleString()}</div>
                        )}
                    </Price>
                </InfoFooter>
            </InfoContainer>
        </CardContainer>
    );
};

export default AccommodationCard;
