import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`;

const ImageContainer = styled.div`
  flex-shrink: 0;
  width: 300px;
  height: 200px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`;

const Description = styled.p`
  font-size: 14px;
  color: #717171;
  margin: 0;
`;

const Title = styled.h3`
  font-size: 18px;
  margin: 4px 0 0 0;
  font-weight: 600;
`;

const PriceContainer = styled.div`
    text-align: right;
`;

const Price = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const RatingContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 8px;
`;

const StarIcon = styled.span`
    color: #ff385c;
    font-size: 14px;
`;


const AccommodationCard = ({ accommodation }) => {
  const { name, imageUrl, pricePerNight, description, rating, reviewCount } = accommodation;

  return (
    <CardContainer>
      <ImageContainer>
        <img src={imageUrl} alt={name} />
      </ImageContainer>
      <InfoContainer>
        <div>
          <Description>{description}</Description>
          <Title>{name}</Title>
        </div>
        <div>
            {rating > 0 && (
                <RatingContainer>
                    <StarIcon>★</StarIcon>
                    <span>{rating.toFixed(2)} ({reviewCount}개)</span>
                </RatingContainer>
            )}
            <PriceContainer>
                <Price>₩{pricePerNight.toLocaleString()} / 박</Price>
            </PriceContainer>
        </div>
      </InfoContainer>
    </CardContainer>
  );
};

export default AccommodationCard;
