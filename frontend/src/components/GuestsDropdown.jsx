import React from 'react';
import styled from 'styled-components';

const GuestsContainer = styled.div`
    padding: 16px;
    width: 350px;
`;

const GuestRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

const GuestType = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    strong {
        font-weight: 600;
    }

    span {
        font-size: 14px;
        color: #717171;
    }
`;

const GuestCounter = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;

    button {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid #ddd;
        background-color: white;
        font-size: 18px;
        cursor: pointer;

        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
    }

    span {
        font-size: 16px;
        width: 20px;
        text-align: center;
    }
`;

const GuestsDropdown = ({guests, setGuests}) => {
    const handleGuestChange = (type, delta) => {
        const newCount = guests[type] + delta;
        if (newCount < 0) return;

        // Adults must be at least 1 if there are children or infants
        if (type === 'adults' && newCount < 1 && (guests.children > 0 || guests.infants > 0)) {
            return;
        }

        setGuests({...guests, [type]: newCount});
    };

    return (
        <GuestsContainer>
            <GuestRow>
                <GuestType>
                    <strong>성인</strong>
                    <span>만 13세 이상</span>
                </GuestType>
                <GuestCounter>
                    <button onClick={() => handleGuestChange('adults', -1)} disabled={guests.adults === 0}>-</button>
                    <span>{guests.adults}</span>
                    <button onClick={() => handleGuestChange('adults', 1)}>+</button>
                </GuestCounter>
            </GuestRow>
            <GuestRow>
                <GuestType>
                    <strong>어린이</strong>
                    <span>만 2-12세</span>
                </GuestType>
                <GuestCounter>
                    <button onClick={() => handleGuestChange('children', -1)} disabled={guests.children === 0}>-</button>
                    <span>{guests.children}</span>
                    <button onClick={() => handleGuestChange('children', 1)} disabled={guests.adults === 0}>+</button>
                </GuestCounter>
            </GuestRow>
            <GuestRow>
                <GuestType>
                    <strong>유아</strong>
                    <span>만 2세 미만</span>
                </GuestType>
                <GuestCounter>
                    <button onClick={() => handleGuestChange('infants', -1)} disabled={guests.infants === 0}>-</button>
                    <span>{guests.infants}</span>
                    <button onClick={() => handleGuestChange('infants', 1)} disabled={guests.adults === 0}>+</button>
                </GuestCounter>
            </GuestRow>
        </GuestsContainer>
    );
};

export default GuestsDropdown; 
