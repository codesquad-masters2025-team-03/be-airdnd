import React, {useEffect, useRef, useState} from 'react';
import styled, {css} from 'styled-components';
import {format} from 'date-fns';
import CalendarDropdown from './CalendarDropdown';
import PriceDropdown from './PriceDropdown';
import GuestsDropdown from './GuestsDropdown';

const SearchBarContainer = styled.div`
    display: inline-flex;
    align-items: center;
    background-color: #ffffff;
    border-radius: 50px;
    height: 66px;
    border: 1px solid #ddd;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    position: relative;
    margin: 20px auto;
    width: auto;
`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    cursor: pointer;
    padding: 0 24px;
    border-radius: 30px;
    position: relative;

    &:hover {
        background-color: #f7f7f7;
    }

    ${({active}) => active && css`
        background-color: white;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        border: 1px solid #eee;
    `}
    label {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 2px;
        pointer-events: none;
        text-align: left;
    }

    input {
        border: none;
        background: transparent;
        font-size: 14px;
        outline: none;
        pointer-events: none;
        color: #222;

        &::placeholder {
            color: #717171;
        }
    }
`;

const GuestInfo = styled.div`
    font-size: 14px;
    color: #222;
    text-align: left;
    padding-right: 20px;
`;

const GuestsInputSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    cursor: pointer;
    padding-left: 24px;
    border-radius: 30px;

    &:hover {
        background-color: #f7f7f7;
    }

    ${({active}) => active && css`
        background-color: white;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        border: 1px solid #eee;
    `}
    & > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: left;
    }
`;


const VerticalDivider = styled.div`
    height: 32px;
    width: 1px;
    background-color: #ddd;
    align-self: center;
`;

const SearchButton = styled.button`
    background-color: #ff385c;
    border: none;
    border-radius: 50px;
    width: auto;
    min-width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0 16px;
    margin: 0 8px;

    svg {
        color: white;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
    }
`;

const DropdownContainer = styled.div`
    position: absolute;
    top: calc(100% + 12px);
    background: white;
    border-radius: 32px;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
    padding: 20px;
    z-index: 10;

    ${({align}) => {
        switch (align) {
            case 'right':
                return css`
                    right: 0;
                    width: 400px;
                `;
            case 'full-width':
                return css`
                    left: 0;
                    right: 0;
                    width: 100%;
                `;
            default:
                return css`
                    left: 50%;
                    transform: translateX(-50%);
                    width: max-content;
                `;
        }
    }}
`;

const SearchText = styled.span`
    color: white;
    font-weight: 600;
    margin-left: 8px;
    white-space: nowrap;
`;

const SearchBar = () => {
    const [activeFilter, setActiveFilter] = useState(null);
    const searchBarRef = useRef(null);

    const [location, setLocation] = useState('');
    const [dates, setDates] = useState({startDate: null, endDate: null});
    const [priceRange, setPriceRange] = useState({min: 0, max: 1000000});
    const [guests, setGuests] = useState({adults: 1, children: 0, infants: 0});

    const totalGuests = guests.adults + guests.children + guests.infants;
    const isAnyFilterActive = location || dates.startDate || (priceRange.min !== 0 && priceRange.max !== 1000000) || totalGuests > 1;

    const handleFilterClick = (filterName, e) => {
        if (e) e.stopPropagation();
        setActiveFilter(activeFilter === filterName ? null : filterName);
    };

    const handleSearch = async (e) => {
        e.stopPropagation();
        setActiveFilter(null);

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const params = {
            page: 1,
            size: 10,
            location: location || "서울",
            checkIn: dates.startDate ? format(dates.startDate, 'yyyy-MM-dd') : format(today, 'yyyy-MM-dd'),
            checkOut: dates.endDate ? format(dates.endDate, 'yyyy-MM-dd') : format(tomorrow, 'yyyy-MM-dd'),
            guests: totalGuests > 0 ? totalGuests : 1,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
        };

        try {
            console.log('Searching with params:', params);
            // const response = await axios.get('/api/accommodations', { params });
            // console.log('Search results:', response.data);
        } catch (error) {
            console.error('Failed to fetch accommodations:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setActiveFilter(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const renderDropdown = () => {
        if (!activeFilter) return null;

        let DropdownComponent;
        let align = 'center';

        switch (activeFilter) {
            case 'location': // Location doesn't have a dropdown in this design
                return null;
            case 'date':
                DropdownComponent = <CalendarDropdown dates={dates} setDates={setDates}/>;
                align = 'full-width';
                break;
            case 'price':
                DropdownComponent =
                    <PriceDropdown priceRange={priceRange} setPriceRange={setPriceRange} dates={dates} guests={guests}
                                   location={location}/>;
                align = 'right';
                break;
            case 'guests':
                DropdownComponent = <GuestsDropdown guests={guests} setGuests={setGuests}/>;
                align = 'right';
                break;
            default:
                return null;
        }

        return (
            <DropdownContainer align={align} onClick={(e) => e.stopPropagation()}>
                {DropdownComponent}
            </DropdownContainer>
        )
    };

    return (
        <SearchBarContainer ref={searchBarRef}>
            <InputSection active={activeFilter === 'location'} onClick={(e) => handleFilterClick('location', e)}>
                <label>여행지</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                       placeholder="여행지 검색"/>
            </InputSection>
            <VerticalDivider/>
            <InputSection active={activeFilter === 'date'} onClick={(e) => handleFilterClick('date', e)}>
                <label>체크인</label>
                <input readOnly placeholder="날짜 추가" value={dates.startDate ? format(dates.startDate, 'M월 d일') : ''}/>
            </InputSection>
            <VerticalDivider/>
            <InputSection active={activeFilter === 'date'} onClick={(e) => handleFilterClick('date', e)}>
                <label>체크아웃</label>
                <input readOnly placeholder="날짜 추가" value={dates.endDate ? format(dates.endDate, 'M월 d일') : ''}/>
            </InputSection>
            <VerticalDivider/>
            <InputSection active={activeFilter === 'price'} onClick={(e) => handleFilterClick('price', e)}>
                <label>요금</label>
                <input readOnly placeholder="요금대 설정"
                       value={(priceRange.min > 0 || priceRange.max < 1000000) ? `₩${priceRange.min.toLocaleString()} - ₩${priceRange.max.toLocaleString()}` : ''}/>
            </InputSection>
            <VerticalDivider/>
            <GuestsInputSection active={activeFilter === 'guests'} onClick={(e) => handleFilterClick('guests', e)}>
                <div>
                    <label style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '2px',
                        pointerEvents: 'none'
                    }}>인원</label>
                    <GuestInfo>{totalGuests > 0 ? `총 ${totalGuests}명` : '게스트 추가'}</GuestInfo>
                </div>
            </GuestsInputSection>
            <SearchButton onClick={handleSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{
                    display: 'block',
                    fill: 'none',
                    height: '16px',
                    width: '16px',
                    stroke: 'currentColor',
                    strokeWidth: 4,
                    overflow: 'visible'
                }}>
                    <path fill="none" d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9"></path>
                </svg>
                {isAnyFilterActive && <SearchText>검색</SearchText>}
            </SearchButton>
            {renderDropdown()}
        </SearchBarContainer>
    );
};

export default SearchBar;
