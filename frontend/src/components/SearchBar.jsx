import React from 'react';
import styled from 'styled-components';

const SearchBarContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #f7f7f7;
    border-radius: 50px;
    padding: 10px 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 1000px;
    margin: 20px auto;
    justify-content: space-between;
`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 좌측 정렬 추가 */
    padding: 0 20px;
    border-right: 1px solid #ddd;

    &:last-of-type {
        border-right: none;
    }

    label {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 5px;
    }

    input {
        border: none;
        background: transparent;
        font-size: 14px;
        outline: none;

        &::placeholder {
            color: #717171;
        }
    }
`;

const SearchButton = styled.button`
    background-color: #ff385c;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: 10px;
    flex-shrink: 0;

    svg {
        color: white;
        width: 20px;
        height: 20px;
    }
`;

const SearchBar = () => {
    return (
        <SearchBarContainer>
            <InputSection>
                <label>위치</label>
                <input type="text" placeholder="지역 입력"/>
            </InputSection>
            <InputSection>
                <label>체크인</label>
                <input type="text" placeholder="날짜 입력"/>
            </InputSection>
            <InputSection>
                <label>체크아웃</label>
                <input type="text" placeholder="날짜 입력"/>
            </InputSection>
            <InputSection>
                <label>요금</label>
                <input type="text" placeholder="금액대 설정"/>
            </InputSection>
            <InputSection>
                <label>인원</label>
                <input type="text" placeholder="게스트 추가"/>
            </InputSection>
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
            </SearchButton>
        </SearchBarContainer>
    );
};

export default SearchBar;
