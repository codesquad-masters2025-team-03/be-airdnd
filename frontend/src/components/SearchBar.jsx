import React, {useEffect, useRef, useState} from 'react';
import styled, {css} from 'styled-components';
import CalendarDropdown from './CalendarDropdown';
import PriceDropdown from './PriceDropdown';
import GuestsDropdown from './GuestsDropdown';

const SearchBarContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #f7f7f7;
    border-radius: 50px;
    padding: 10px 10px 10px 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 850px;
    margin: 20px auto;
    justify-content: space-between;
    position: relative;
`;

const InputSectionContainer = styled.div`
    display: flex;
    flex-grow: 1;
    border-radius: 50px;

    & > div:first-child {
        border-top-left-radius: 50px;
        border-bottom-left-radius: 50px;
    }
`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    cursor: pointer;
    background-color: transparent;
    padding: 10px 20px;
    flex-grow: 1;

    &:hover {
        background-color: #ebebeb;
        border-radius: 30px;
    }

    ${({active}) => active && css`
        background-color: white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        border-radius: 30px;
    `}
    label {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 5px;
        pointer-events: none;
    }

    input {
        border: none;
        background: transparent;
        font-size: 14px;
        outline: none;
        pointer-events: none;

        &::placeholder {
            color: #717171;
        }
    }
`;

const VerticalDivider = styled.div`
    height: 30px;
    width: 1px;
    background-color: #ddd;
    align-self: center;
`;

const SearchButton = styled.button`
    background-color: #ff385c;
    border: none;
    border-radius: 50px;
    min-width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: 10px;
    flex-shrink: 0;
    padding: 0 16px;

    svg {
        color: white;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
    }
`;

const DropdownContainer = styled.div`
    position: absolute;
    top: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border-radius: 32px;
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
    padding: 16px 32px;
    z-index: 10;
    width: max-content;
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
    const [guests, setGuests] = useState({adults: 0, children: 0, infants: 0});

    const totalGuests = guests.adults + guests.children + guests.infants;
    const isAnyFilterActive = location || dates.startDate || (priceRange.min !== 0 || priceRange.max !== 1000000) || totalGuests > 0;

    const handleFilterClick = (filterName) => {
        setActiveFilter(activeFilter === filterName ? null : filterName);
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
        switch (activeFilter) {
            case 'date':
                DropdownComponent = <CalendarDropdown dates={dates} setDates={setDates}/>;
                break;
            case 'price':
                DropdownComponent =
                    <PriceDropdown priceRange={priceRange} setPriceRange={setPriceRange} location={location}
                                   dates={dates} guests={guests}/>;
                break;
            case 'guests':
                DropdownComponent = <GuestsDropdown guests={guests} setGuests={setGuests}/>;
                break;
            case 'location':
                return null; // Location input is in-place
            default:
                return null;
        }

        return (
            <DropdownContainer>
                {DropdownComponent}
            </DropdownContainer>
        )
    };

    return (
        <SearchBarContainer ref={searchBarRef}>
            <InputSectionContainer>
                <InputSection active={activeFilter === 'location'} onClick={() => handleFilterClick('location')}>
                    <label>위치</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                           placeholder="지역으로 검색"/>
                </InputSection>
                <VerticalDivider/>
                <InputSection active={activeFilter === 'date'} onClick={() => handleFilterClick('date')}>
                    <label>체크인</label>
                    <input readOnly placeholder="날짜 추가"
                           value={dates.startDate ? dates.startDate.toLocaleDateString() : ''}/>
                </InputSection>
                <VerticalDivider/>
                <InputSection active={activeFilter === 'date'} onClick={() => handleFilterClick('date')}>
                    <label>체크아웃</label>
                    <input readOnly placeholder="날짜 추가"
                           value={dates.endDate ? dates.endDate.toLocaleDateString() : ''}/>
                </InputSection>
                <VerticalDivider/>
                <InputSection active={activeFilter === 'price'} onClick={() => handleFilterClick('price')}>
                    <label>요금</label>
                    <input readOnly placeholder="요금대 설정"
                           value={(priceRange.min !== 0 || priceRange.max !== 1000000) ? `₩${priceRange.min.toLocaleString()} - ₩${priceRange.max.toLocaleString()}` : ''}/>
                </InputSection>
                <VerticalDivider/>
                <InputSection active={activeFilter === 'guests'} onClick={() => handleFilterClick('guests')}>
                    <label>인원</label>
                    <input readOnly placeholder="게스트 추가" value={totalGuests > 0 ? `총 ${totalGuests}명` : ''}/>
                </InputSection>
            </InputSectionContainer>
            <SearchButton>
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
